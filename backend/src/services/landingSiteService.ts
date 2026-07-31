import { eq } from "drizzle-orm";
import { db } from "../db";
import { landingSites } from "../db/schema";
import { weatherService } from "./weatherService";
import { coverageTrendService } from "./coverageTrendService";
import { riskScoringService, RiskLevel } from "./riskScoringService";
import { alertService } from "./alertService";

export class LandingSiteService {
    public async evaluateCoverage(siteId: number, coveragePercentage: number, dominantQualityGrade: string) {
        // 1. Fetch site
        const [existingSite] = await db.select().from(landingSites).where(eq(landingSites.id, siteId));
        if (!existingSite) throw new Error("Landing site not found");

        // 2. Record this coverage reading to history
        await coverageTrendService.recordCoverage(siteId, coveragePercentage, dominantQualityGrade);

        return this.evaluateRisk(siteId, coveragePercentage, dominantQualityGrade, existingSite.bmuLeaderPhone);
    }

    public async evaluateRisk(siteId: number, currentCoverage?: number, currentGrade?: string, bmuLeaderPhone?: string | null) {
        const [site] = await db.select().from(landingSites).where(eq(landingSites.id, siteId));
        if (!site) throw new Error("Landing site not found");

        const coverage = currentCoverage ?? site.coveragePercentage;
        const grade = currentGrade ?? site.dominantQualityGrade;

        // Compute coverage trend
        const coverageTrend = await coverageTrendService.getTrend(siteId);

        // Fetch weather and temp anomaly
        const lat = site.latitude ? Number(site.latitude) : -0.0917;
        const lng = site.longitude ? Number(site.longitude) : 34.7680;
        
        const { tempAnomaly, rainfall } = await weatherService.getCurrentWeather(site.name, lat, lng);

        // Calculate predictive risk level
        const riskLevel = riskScoringService.calculateRiskLevel({
            coverage,
            coverageTrend,
            tempAnomaly,
            rainfall
        });

        // Map to operationalStatus for backwards compatibility
        let operationalStatus = "SAFE";
        if (riskLevel === "emergency") operationalStatus = "RED_ALERT";
        else if (riskLevel === "warning" || riskLevel === "watch") operationalStatus = "MONITOR";

        // Persist updates
        const updatedSites = await db.update(landingSites)
            .set({
                coveragePercentage: coverage,
                dominantQualityGrade: grade,
                operationalStatus,
                riskLevel,
                updatedAt: new Date()
            })
            .where(eq(landingSites.id, siteId))
            .returning();

        const updatedSite = updatedSites[0];
        if (!updatedSite) throw new Error("Failed to persist landing site risk update");

        // Tiered, multi-recipient alert dispatch (watch/warning/emergency).
        // "normal" tier dispatches nothing — see AlertService for rationale.
        const dispatchedAlerts = await alertService.dispatchAlert({
            site: {
                id: updatedSite.id,
                name: updatedSite.name,
                bmuLeaderPhone: bmuLeaderPhone || updatedSite.bmuLeaderPhone,
                countyHealthOfficerPhone: updatedSite.countyHealthOfficerPhone,
                waterOfficerPhone: updatedSite.waterOfficerPhone,
                isBlockingWaterPoint: updatedSite.isBlockingWaterPoint,
            },
            riskLevel,
            coverage,
            coverageTrend,
        });

        // Kept for backwards compatibility with callers/UI expecting a single
        // string (e.g. the BMU leader's message, if one was sent this tier).
        const smsAlertPayload = dispatchedAlerts.find(a => a.recipientRole === "bmu_leader")?.message ?? null;

        return { site: updatedSite, smsAlertPayload, alerts: dispatchedAlerts };
    }
}

export const landingSiteService = new LandingSiteService();
