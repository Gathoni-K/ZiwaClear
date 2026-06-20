import { Request, Response } from "express";
import { batchService } from "../services/batchService";

export class BatchController {
    public async create(req: Request, res: Response) {
        try {
            const { beachId, timeWindowStart, timeWindowEnd } = req.body;
            const createdBy = (req as any).user?.id || "system";
            const batch = await batchService.createBatch(beachId, timeWindowStart, timeWindowEnd, createdBy);
            return res.status(201).json({ success: true, data: batch });
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
                status: req.query.status as any,
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
            const batch = await batchService.getBatchById(id);
            if (!batch) return res.status(404).json({ success: false, message: "Batch not found" });
            return res.json({ success: true, data: batch });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    public async close(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await batchService.closeBatch(id);
            return res.json({ success: true, message: "Batch closed successfully" });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    public async getAggregation(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const aggregation = await batchService.getBatchAggregation(id);
            if (!aggregation) return res.status(404).json({ success: false, message: "Batch or aggregation not found" });
            return res.json({ success: true, data: aggregation });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    public async addSMS(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { smsId } = req.body;
            await batchService.addSMSBatch(id, smsId);
            return res.json({ success: true, message: "SMS added to batch" });
        } catch (error: any) {
            if (error.message.includes("not collecting")) return res.status(400).json({ success: false, message: error.message });
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    public async autoBatch(req: Request, res: Response) {
        try {
            await batchService.autoBatchSMS();
            return res.json({ success: true, message: "Auto-batching triggered successfully" });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    public async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await batchService.deleteBatch(id);
            return res.json({ success: true, message: "Batch deleted successfully" });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
}

export const batchController = new BatchController();
