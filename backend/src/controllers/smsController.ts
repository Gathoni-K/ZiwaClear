import { Request, Response } from "express";
import { smsService } from "../services/smsService";
import { smsClient } from "../utils/africasTalking";

export class SMSController {
    public async receiveSMS(req: Request, res: Response) {
        try {
            const { text, from } = req.body;

            const result = await smsService.processIncomingSMS(text, from);

            // Build the reply message
            let replyMessage: string;

            if (result.success && result.batch) {
                const shortId: string = result.batch.id?.substring(0, 8) ?? "N/A";
                replyMessage = `Imethibitishwa: ${result.batch.quantityKg}kg ${result.batch.locationName}. Rejesta: ${shortId}. Utapata taarifa mnunuzi anapochukua.`;
            } else if (result.success && !result.batch) {
                replyMessage = "Tumepokea ujumbe wako lakini hatukuweza kutambua eneo au uzito. Tuma mfano: 100kg Dunga";
            } else {
                replyMessage = "Samahani, hatujaelewa ujumbe wako. Tuma mfano: 100kg Dunga";
            }

            // Send the reply SMS via Africa's Talking
            try {
                await smsClient.send({
                    to: [from],
                    message: replyMessage,
                    from: process.env.AT_SHORTCODE || "5862",
                });
            } catch (smsError) {
                console.error("Failed to send reply SMS:", smsError);
                // Don't fail the webhook if the reply fails — batch is already created
            }

            // Return 200 to Africa's Talking so they know we processed it
            return res.status(200).json({
                success: true,
                sms_id: result.smsRecord.id,
                batch_id: result.batch?.id ?? null,
                status: result.success ? "processed" : "failed",
            });
        } catch (error: any) {
            if (error.message.includes("Duplicate message")) {
                return res.status(200).json({
                    success: true,
                    message: "Duplicate message ignored",
                });
            }
            console.error("SMS webhook error:", error);
            return res.status(200).json({
                success: false,
                message: "Internal processing error",
            });
        }
    }

    public async getSMS(req: Request, res: Response) {
        try {
            const { id } = req.params;
             if (!id || typeof id !== "string") {
                return res.status(400).json({ success: false, message: "Invalid ID" });
            }

            const record = await smsService.getById(id);
            if (!record) {
                return res.status(404).json({ success: false, message: "SMS not found" });
            }
            return res.json({ success: true, data: record });
        } catch (error) {
            console.error("getSMS error:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    public async listSMS(req: Request, res: Response) {
        try {
            const filters = {
                startDate: req.query.startDate as string | undefined,
                endDate: req.query.endDate as string | undefined,
                beachId: req.query.beachId ? parseInt(req.query.beachId as string) : undefined,
                batchId: req.query.batchId as string | undefined,
                parsedSuccessfully:
                    req.query.parsedSuccessfully === "true"
                        ? true
                        : req.query.parsedSuccessfully === "false"
                            ? false
                            : undefined,
                limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
                offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
            };
            const records = await smsService.listSMS(filters);
            return res.json({ success: true, data: records });
        } catch (error) {
            console.error("listSMS error:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
}

export const smsController = new SMSController();