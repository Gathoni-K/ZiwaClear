import { Request, Response } from "express";
import { smsService } from "../services/smsService";

export class SMSController {
    public async receiveSMS(req: Request, res: Response) {
        try {
            const { message, sender, received_at } = req.body;
            
            const smsRecord = await smsService.processIncomingSMS(message, sender);
            
            return res.status(202).json({
                success: true,
                sms_id: smsRecord.id,
                status: "received",
                message: "SMS received and queued for processing"
            });
        } catch (error: any) {
            if (error.message.includes("Duplicate message")) {
                return res.status(409).json({ success: false, message: error.message });
            }
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    public async getSMS(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const record = await smsService.getById(id);
            if (!record) return res.status(404).json({ success: false, message: "SMS not found" });
            return res.json({ success: true, data: record });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    public async listSMS(req: Request, res: Response) {
        try {
            const filters = {
                startDate: req.query.startDate as string,
                endDate: req.query.endDate as string,
                beachId: req.query.beachId ? parseInt(req.query.beachId as string) : undefined,
                batchId: req.query.batchId as string,
                parsedSuccessfully: req.query.parsedSuccessfully ? req.query.parsedSuccessfully === "true" : undefined,
                processed: req.query.processed ? req.query.processed === "true" : undefined,
                limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
                offset: req.query.offset ? parseInt(req.query.offset as string) : 0
            };
            const records = await smsService.listSMS(filters);
            return res.json({ success: true, data: records });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    public async reprocess(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const record = await smsService.reprocess(id);
            return res.json({ success: true, data: record });
        } catch (error: any) {
            if (error.message === "SMS not found") return res.status(404).json({ success: false, message: error.message });
            if (error.message.includes("already parsed")) return res.status(400).json({ success: false, message: error.message });
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    public async getStats(req: Request, res: Response) {
        try {
            const stats = await smsService.getStats();
            return res.json({ success: true, data: stats });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    public async cleanup(req: Request, res: Response) {
        try {
            const days = parseInt(req.query.days as string) || 30;
            await smsService.deleteOlderThan(days);
            return res.json({ success: true, message: `Cleaned up SMS older than ${days} days` });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
}

export const smsController = new SMSController();
