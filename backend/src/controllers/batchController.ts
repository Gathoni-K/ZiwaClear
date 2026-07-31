import { Request, Response } from "express";
import { batchService } from "../services/batchService";
import { landingSiteService } from "../services/landingSiteService";
import { impactMetricsService } from "../services/impactMetricsServices";
import { qualityRatingToGrade, getActiveMass, activeMassToBiogasM3, activeMassToCO2eKg, rawMassToSurfaceM2 } from "../utils/ecologicalMath";
import { initiateMockB2CPayout } from "../services/mpesaService";
import { db } from "../db";
import { transactions } from "../db/schema";

export class BatchController {
    public async listAvailable(req: Request, res: Response) {
        try {
            const batches = await batchService.getAvailableBatches();
            return res.json({ success: true, data: batches });
        } catch (error) {
            console.error("[BatchController.listAvailable] Error:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    public async list(req: Request, res: Response) {
        try {
            const filters = {
                startDate: req.query.startDate as string | undefined,
                endDate: req.query.endDate as string | undefined,
                beachId: req.query.beachId ? parseInt(req.query.beachId as string) : undefined,
                status: req.query.status as string | undefined,
                limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
                offset: req.query.offset ? parseInt(req.query.offset as string) : 0
            } as Parameters<typeof batchService.listBatches>[0];
            const batches = await batchService.listBatches(filters);
            return res.json({ success: true, data: batches });
        } catch (error) {
            console.error("[BatchController.list] Error:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    public async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id || typeof id !== "string") {
                return res.status(400).json({ success: false, message: "Invalid ID" });
            }

            const batch = await batchService.getBatchById(id);

            if (!batch) return res.status(404).json({ success: false, message: "Batch not found" });

            const grade = qualityRatingToGrade(batch.qualityRating);
            const activeMass = getActiveMass(batch.quantityKg, grade);
            const biogasM3 = activeMassToBiogasM3(activeMass);
            const co2eKg = activeMassToCO2eKg(activeMass);
            const surfaceAreaM2 = rawMassToSurfaceM2(batch.quantityKg);
            const fertilizerKgN = Math.round(batch.quantityKg * 0.002 * 1000) / 1000;

            return res.json({
                success: true,
                data: {
                    ...batch,
                    yieldPredictions: {
                        biogasM3,
                        co2eKg,
                        surfaceAreaM2,
                        fertilizerKgN,
                        source: "Gunaseelan (1997), IPCC Wetlands Supplement (2014)"
                    }
                }
            });
        } catch (error) {
            console.error("[BatchController.getById] Error:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    public async claim(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id || typeof id !== "string") {
                return res.status(400).json({ success: false, message: "Invalid ID" });
            }

            const buyerId = (req as any).user?.buyerId || req.body.buyerId;
            if (!buyerId) {
                return res.status(400).json({ success: false, message: "Missing buyer ID" });
            }
            const batch = await batchService.claimBatch(id, buyerId);
            return res.json({ success: true, data: batch, message: "Batch claimed successfully" });
        } catch (error: any) {
            console.error("[BatchController.claim] Error:", error);
            if (error.message === "Batch not found") return res.status(404).json({ success: false, message: error.message });
            if (error.message === "Batch is not available") return res.status(400).json({ success: false, message: error.message });
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    public async collect(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id || typeof id !== "string") {
                return res.status(400).json({ success: false, message: "Invalid ID" });
            }

            const { qualityRating, notes } = req.body;
            const batch = await batchService.collectBatch(id, qualityRating, notes);

            if (!batch) {
                return res.status(404).json({ success: false, message: "Batch not found" });
            }

            const payoutAmount = batch.quantityKg * 9;
            const payout = await initiateMockB2CPayout(batch.harvesterPhone, payoutAmount);

            if (payout.success && batch.buyerId) {
                await db.insert(transactions).values({
                    batchId: batch.id,
                    buyerId: batch.buyerId,
                    payoutAmount,
                    mpesaReceiptNumber: payout.receiptNumber,
                    status: "paid",
                });
            }

            return res.json({
                success: true,
                data: batch,
                message: "Batch collected successfully",
                mpesaReceiptNumber: payout.receiptNumber,
            });
        } catch (error: any) {
            console.error("[BatchController.collect] Error:", error);
            if (error.message === "Batch not found") return res.status(404).json({ success: false, message: error.message });
            if (error.message.includes("must be claimed")) return res.status(400).json({ success: false, message: error.message });
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    /**
     * Cumulative impact totals for the dashboard cards (Surface Restored,
     * Biogas Generated, Carbon Offset). Replaces the old batchService.getImpactStats()
     * call, which predates the sourced ecological math in impactMetricsService.ts.
     *
     * `icon` is intentionally omitted -- a LucideIcon reference isn't
     * serializable over JSON. The frontend maps `id` -> icon locally.
     * `trend`/`badge` are also omitted since neither is computable from
     * raw kg sums without a prior-period comparison or a separate
     * certification workflow, neither of which exist yet.
     */
    public async getImpact(req: Request, res: Response) {
        try {
            const metrics = await impactMetricsService.getCumulativeImpactMetrics();

            const data = [
                {
                    id: "surface-restored",
                    label: "Surface Restored",
                    value: `${metrics.surfaceRestoredM2.toLocaleString(undefined, { maximumFractionDigits: 0 })} m²`,
                    description: "Cleaned water hyacinth coverage",
                },
                {
                    id: "biogas-generated",
                    label: "Sustainable Biogas Generated",
                    value: `${metrics.biogasGeneratedM3.toLocaleString(undefined, { maximumFractionDigits: 0 })} m³`,
                    description: "Cumulative biogas yield from claimed and collected biomass",
                },
                {
                    id: "carbon-offset",
                    label: "Carbon Offset",
                    value: `${metrics.co2eAvoidedTonnes.toLocaleString(undefined, { maximumFractionDigits: 1 })} tonnes CO2e`,
                    description: "Methane emissions avoided by diverting biomass from the lake",
                },
            ];

            return res.json({ success: true, data });
        } catch (error) {
            console.error("[BatchController.getImpact] Error:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    /**
     * Monthly trend feeding the analytics graph. Exposes all three
     * derived metrics per month (surface restored, biogas, CO2e), not
     * just biogas m3, since the service computes all three from the
     * same aggregate query at no extra cost.
     */
    public async getImpactTrend(req: Request, res: Response) {
        try {
            const trend = await impactMetricsService.getBiogasTrend();
            return res.json({ success: true, data: trend });
        } catch (error) {
            console.error("[BatchController.getImpactTrend] Error:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    /**
     * Alert acknowledgment/resolution time-to-response metric — extends the
     * impact dashboard (Step 4). Demo can watch this move as alerts fire
     * and get acknowledged during the recorded run.
     */
    public async getAlertResponseMetrics(req: Request, res: Response) {
        try {
            const windowDays = req.query.windowDays ? parseInt(req.query.windowDays as string) : 30;
            const data = await impactMetricsService.getAlertResponseMetrics(windowDays);
            return res.json({ success: true, data });
        } catch (error) {
            console.error("[BatchController.getAlertResponseMetrics] Error:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    public async getPrice(req: Request, res: Response) {
        try {
            return res.json({
                success: true,
                data: {
                    price_kes_per_kg: 9,
                    currency: "KES",
                    updated_at: new Date().toISOString(),
                    note: "Average market rate based on recent transactions"
                }
            });
        } catch (error) {
            console.error("[BatchController.getPrice] Error:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    public async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id || typeof id !== "string") {
                return res.status(400).json({ success: false, message: "Invalid ID" });
            }

            await batchService.deleteBatch(id);
            return res.json({ success: true, message: "Batch deleted successfully" });
        } catch (error) {
            console.error("[BatchController.delete] Error:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    public async simulateCoverageSpike(req: Request, res: Response) {
        try {
            const { siteId, coveragePercentage, dominantQualityGrade } = req.body;
            
            if (!siteId || typeof coveragePercentage !== 'number' || !dominantQualityGrade) {
                return res.status(400).json({ success: false, message: "Invalid payload" });
            }

            const result = await landingSiteService.evaluateCoverage(
                parseInt(siteId.toString()), 
                coveragePercentage, 
                dominantQualityGrade
            );

            return res.json({ 
                success: true, 
                data: {
                    site: result.site,
                    smsAlertPayload: result.smsAlertPayload
                }
            });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message || "Internal server error" });
        }
    }
}

export const batchController = new BatchController();