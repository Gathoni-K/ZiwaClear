import { Request, Response } from "express";
import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { batchService } from "../services/batchService";

interface SimpleMessage {
    role: "user" | "assistant" | "system";
    content: string;
}

export class ChatController {
    public async chat(req: Request, res: Response) {
        try {
            const { messages } = req.body as { messages: SimpleMessage[] };

            const availableBatches = await batchService.getAvailableBatches();
            const totalKg = availableBatches.reduce((sum, batch) => sum + batch.quantityKg, 0);
            const locations = [...new Set(availableBatches.map((batch) => batch.locationName))];

            const systemPrompt = `You are the ZiwaClear assistant. You help biogas buyers find water hyacinth biomass batches harvested from Lake Victoria. There are currently ${availableBatches.length} available batches totaling ${totalKg}kg of biomass, located at: ${locations.length > 0 ? locations.join(", ") : "no locations right now"}. Answer questions about batch availability, locations, pricing, and how claiming works. Keep answers short and practical.`;

            const result = streamText({
                model: google(process.env.LLM_MODEL ?? "gemini-2.0-flash"),
                system: systemPrompt,
                messages,
                onError: ({ error }) => {
                    console.error("Stream error:", error);
                },
            });

            result.pipeTextStreamToResponse(res);
        } catch (error) {
            console.error("Chat error:", error);
            if (!res.headersSent) {
                res.status(500).json({ success: false, message: "Chat unavailable" });
            }
        }
    }
}

export const chatController = new ChatController();