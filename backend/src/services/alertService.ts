import { eq, and, isNull, desc } from "drizzle-orm";
import { db } from "../db";
import { alerts } from "../db/schema/alerts";
import { smsClient } from "../utils/africasTalking";
import { RiskLevel } from "./riskScoringService";
import { CoverageTrend } from "./coverageTrendService";

export type RecipientRole = "bmu_leader" | "county_health_officer" | "water_officer";

export interface AlertSiteContext {
    id: number;
    name: string;
    bmuLeaderPhone: string;
    countyHealthOfficerPhone?: string | null;
    waterOfficerPhone?: string | null;
    isBlockingWaterPoint?: boolean | null;
}

export interface AlertDispatchInputs {
    site: AlertSiteContext;
    riskLevel: RiskLevel;
    coverage: number;
    coverageTrend: CoverageTrend;
}

const RECOMMENDED_ACTIONS: Record<RiskLevel, string> = {
    watch: "Monitor coverage trend; no harvester dispatch needed yet.",
    warning: "Dispatch available harvesters to the site within 24 hours; notify county health officer of rising bloom risk.",
    emergency: "Dispatch harvesters immediately; site poses cholera-correlation risk if left unmanaged.",
    normal: "No action required.",
};

export class AlertService {
    /**
     * Determines which recipient roles should be notified for a given risk
     * tier, per the brief: BMU leader on every non-normal tier, county
     * health officer on warning/emergency (cholera correlation), and the
     * water/WASH officer only if the site is flagged as blocking a known
     * water point.
     *
     * Design decision (documented, not silent): "normal" tier does not
     * dispatch any SMS — alerting on every normal reading would spam
     * recipients on every ingestion/simulation tick. The riskLevel is still
     * persisted on the site for every evaluation regardless of tier.
     */
    private recipientsForTier(site: AlertSiteContext, riskLevel: RiskLevel): { role: RecipientRole; phone: string }[] {
        if (riskLevel === "normal") return [];

        const recipients: { role: RecipientRole; phone: string }[] = [];

        if (site.bmuLeaderPhone) {
            recipients.push({ role: "bmu_leader", phone: site.bmuLeaderPhone });
        }

        if ((riskLevel === "warning" || riskLevel === "emergency") && site.countyHealthOfficerPhone) {
            recipients.push({ role: "county_health_officer", phone: site.countyHealthOfficerPhone });
        }

        if (site.isBlockingWaterPoint && site.waterOfficerPhone) {
            recipients.push({ role: "water_officer", phone: site.waterOfficerPhone });
        }

        return recipients;
    }

    private buildMessage(role: RecipientRole, site: AlertSiteContext, riskLevel: RiskLevel, coverage: number, coverageTrend: CoverageTrend): string {
        const action = RECOMMENDED_ACTIONS[riskLevel];
        const base = `ZiwaClear ${riskLevel.toUpperCase()}: ${site.name} at ${coverage}% hyacinth coverage (trend: ${coverageTrend}).`;

        if (role === "county_health_officer") {
            return `${base} Flagged for water-quality/cholera-risk monitoring. ${action} Reply RECEIVED to acknowledge.`;
        }
        if (role === "water_officer") {
            return `${base} This site may be blocking a known water point. ${action} Reply RECEIVED to acknowledge.`;
        }
        return `${base} ${action} Reply RECEIVED to acknowledge, CLEARED once resolved.`;
    }

    /**
     * Dispatches alerts to every recipient appropriate for the tier, persists
     * one row per recipient in `alerts`, and returns the payloads sent (for
     * the caller's API response / demo visibility). SMS failures are logged
     * and non-fatal — the alert row is still persisted with status "sent"
     * so the acknowledgment loop can still be demoed even if the SMS gateway
     * (e.g. sandbox Africa's Talking credentials) is unreachable.
     */
    public async dispatchAlert({ site, riskLevel, coverage, coverageTrend }: AlertDispatchInputs) {
        const recipients = this.recipientsForTier(site, riskLevel);
        if (recipients.length === 0) return [];

        const eventType = "hyacinth_bloom";
        const timestamp = new Date().toISOString();
        const recommendedAction = RECOMMENDED_ACTIONS[riskLevel];

        const dispatched = [];

        for (const recipient of recipients) {
            const message = this.buildMessage(recipient.role, site, riskLevel, coverage, coverageTrend);

            const payload = {
                eventType,
                severity: riskLevel,
                area: site.name,
                timestamp,
                recommendedAction,
                recipientRole: recipient.role,
            };

            try {
                await smsClient.send({
                    to: [recipient.phone],
                    message,
                    from: process.env.AFRICASTALKING_SHORTCODE || "5862",
                });
            } catch (smsError) {
                console.error(`[AlertService] Failed to send ${riskLevel} SMS to ${recipient.role}:`, smsError);
                // Non-fatal: still logged below so the demo/acknowledgment loop can proceed.
            }

            const [record] = await db.insert(alerts).values({
                siteId: site.id,
                eventType,
                severity: riskLevel,
                area: site.name,
                recommendedAction,
                recipientRole: recipient.role,
                recipientPhone: recipient.phone,
                message,
                payload,
                status: "sent",
            }).returning();

            if (!record) {
                console.error(`[AlertService] Failed to persist alert row for ${recipient.role} at site ${site.id}`);
                continue;
            }

            dispatched.push({ ...payload, recipientPhone: recipient.phone, message, alertId: record.id });
        }

        return dispatched;
    }

    /**
     * Handles an inbound SMS reply that may be an acknowledgment/resolution
     * keyword rather than a harvest report. Matches against the most recent
     * un-acknowledged (or un-resolved) alert sent to this phone number.
     * Returns null if the phone has no matching open alert, or if the
     * message isn't a recognized keyword — callers should fall back to
     * normal SMS/harvest parsing in that case.
     */
    public async handleAcknowledgment(rawMessage: string, senderPhone: string): Promise<{ matched: boolean; keyword?: "RECEIVED" | "CLEARED"; alertId?: number; siteName?: string }> {
        const normalized = rawMessage.trim().toUpperCase();
        const isReceived = normalized === "RECEIVED" || normalized.startsWith("RECEIVED ");
        const isCleared = normalized === "CLEARED" || normalized.startsWith("CLEARED ");

        if (!isReceived && !isCleared) {
            return { matched: false };
        }

        const keyword = isReceived ? "RECEIVED" : "CLEARED";

        // Find the most recent alert sent to this phone that's still open
        // for the action being taken.
        const targetStatusFilter = isCleared ? undefined : isNull(alerts.acknowledgedAt);

        const [candidate] = await db.select().from(alerts)
            .where(
                targetStatusFilter
                    ? and(eq(alerts.recipientPhone, senderPhone), targetStatusFilter)
                    : eq(alerts.recipientPhone, senderPhone)
            )
            .orderBy(desc(alerts.sentAt))
            .limit(1);

        if (!candidate) {
            return { matched: false };
        }

        const now = new Date();
        if (isReceived) {
            await db.update(alerts)
                .set({ acknowledgedAt: now, status: "acknowledged" })
                .where(eq(alerts.id, candidate.id));
        } else {
            await db.update(alerts)
                .set({ resolvedAt: now, status: "cleared", acknowledgedAt: candidate.acknowledgedAt ?? now })
                .where(eq(alerts.id, candidate.id));
        }

        return { matched: true, keyword, alertId: candidate.id, siteName: candidate.area };
    }
}

export const alertService = new AlertService();
