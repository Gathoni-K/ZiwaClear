import { Request, Response } from "express";
import { eq, gte } from "drizzle-orm";
import { db } from "../db";
import { landingSites, alerts } from "../db/schema";
import { landingSiteService } from "../services/landingSiteService";

export class LandingSiteController {
    public async getAll(req: Request, res: Response) {
        try {
            const sites = await db.select().from(landingSites);
            return res.json({ success: true, data: sites });
        } catch (error: any) {
            console.error("[LandingSiteController.getAll] Error:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    public async getOne(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (!Number.isFinite(id)) {
                return res.status(400).json({ success: false, message: "Invalid site id" });
            }
            const [site] = await db.select().from(landingSites).where(eq(landingSites.id, id));
            if (!site) {
                return res.status(404).json({ success: false, message: "Landing site not found" });
            }
            return res.json({ success: true, data: site });
        } catch (error: any) {
            console.error("[LandingSiteController.getOne] Error:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    /**
     * Manual evaluate-risk trigger (Step 2, trigger c). Re-runs the same
     * risk pipeline used by SMS/batch ingestion and the coverage-spike
     * simulation, without changing the last recorded coverage reading —
     * useful for re-scoring a site against fresh weather data on demand.
     */
    public async evaluateRisk(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (!Number.isFinite(id)) {
                return res.status(400).json({ success: false, message: "Invalid site id" });
            }
            const result = await landingSiteService.evaluateRisk(id);
            return res.json({ success: true, data: result });
        } catch (error: any) {
            console.error("[LandingSiteController.evaluateRisk] Error:", error);
            return res.status(500).json({ success: false, message: error.message || "Internal server error" });
        }
    }

    /**
     * Aggregate view across all sites: current risk distribution plus
     * alert-response metrics (time-to-acknowledge), so the demo/judges can
     * see the detect->alert->acknowledge loop as one number, not just a list.
     * This is the endpoint the frontend (api/config.ts, useLandingSiteMetrics)
     * was already calling before it existed.
     */
    public async getMetrics(req: Request, res: Response) {
        try {
            const sites = await db.select().from(landingSites);

            const riskCounts: Record<string, number> = { normal: 0, watch: 0, warning: 0, emergency: 0 };
            for (const site of sites) {
                riskCounts[site.riskLevel] = (riskCounts[site.riskLevel] || 0) + 1;
            }

            const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // last 30 days
            const recentAlerts = await db.select().from(alerts).where(gte(alerts.sentAt, since));

            const acknowledged = recentAlerts.filter(a => a.acknowledgedAt);
            const avgResponseSeconds = acknowledged.length > 0
                ? Math.round(
                    acknowledged.reduce((sum, a) => sum + (a.acknowledgedAt!.getTime() - a.sentAt.getTime()) / 1000, 0)
                    / acknowledged.length
                )
                : null;

            return res.json({
                success: true,
                data: {
                    totalSites: sites.length,
                    riskCounts,
                    alertsSent30d: recentAlerts.length,
                    alertsAcknowledged30d: acknowledged.length,
                    avgResponseSeconds,
                }
            });
        } catch (error: any) {
            console.error("[LandingSiteController.getMetrics] Error:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
}

export const landingSiteController = new LandingSiteController();
