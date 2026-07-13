import { Request, Response } from "express";
import { batchService } from "../services/batchService";
import { impactMetricsService } from "../services/impactMetricsServices";

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

            // NOTE: this per-batch yield preview uses a different, uncited
            // 0.07 m3/kg factor than the sourced 0.0224 m3/kg wet-mass factor
            // used in impactMetricsService.ts / ecologicalMath.ts. Flagging
            // this inconsistency rather than silently changing it.
            const biogasM3 = Math.round(batch.quantityKg * 0.07 * 100) / 100;
            const fertilizerKgN = Math.round(batch.quantityKg * 0.002 * 1000) / 1000;

            return res.json({
                success: true,
                data: {
                    ...batch,
                    yieldPredictions: {
                        biogasM3,
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

            const { buyerId } = req.body;
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
            return res.json({ success: true, data: batch, message: "Batch collected successfully" });
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
}

export const batchController = new BatchController();