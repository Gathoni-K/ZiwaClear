import { Request, Response } from "express";
import { batchService } from "../services/batchService";

export class BatchController {
    public async listAvailable(req: Request, res: Response) {
        try {
            const batches = await batchService.getAvailableBatches();
            return res.json({ success: true, data: batches });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    public async list(req: Request, res: Response) {
        try {
            const filters = {
                startDate: req.query.startDate as string,
                endDate: req.query.endDate as string,
                beachId: req.query.beachId ? parseInt(req.query.beachId as string) : undefined,
                status: req.query.status as string,
                limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
                offset: req.query.offset ? parseInt(req.query.offset as string) : 0
            };
            const batches = await batchService.listBatches(filters);
            return res.json({ success: true, data: batches });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    public async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id || typeof id !== "string") {
                return res.status(400).json({ success: false, message: "Invalid ID" });
            }

            const batchId = parseInt(id, 10);
            if (isNaN(batchId)) {
                return res.status(400).json({ success: false, message: "ID must be a valid number" })
            }
            const batch = await batchService.getBatchById(id);

            if (!batch) return res.status(404).json({ success: false, message: "Batch not found" });

            // Attach yield predictions
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
            if (error.message === "Batch not found") return res.status(404).json({ success: false, message: error.message });
            if (error.message.includes("must be claimed")) return res.status(400).json({ success: false, message: error.message });
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    public async getImpact(req: Request, res: Response) {
        try {
            const impact = await batchService.getImpactStats();
            return res.json({ success: true, data: impact });
        } catch (error) {
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
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
}

export const batchController = new BatchController();