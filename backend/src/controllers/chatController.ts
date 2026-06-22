import { Request, Response } from "express";
import { streamText, convertToModelMessages } from "ai";
import { openai } from "@ai-sdk/openai";
import { batchService } from "../services/batchService";

export class ChatController {
    public async chat(req: Request, res: Response) {
        try {
            const { messages } = req.body;

            const availableBatches = await batchService.getAvailableBatches();
            const totalKg = availableBatches.reduce((sum, batch) => sum + batch.quantityKg, 0);
            const locations = [...new Set(availableBatches.map((batch) => batch.locationName))];

            const systemPrompt = `You are the ZiwaClear assistant. You help biogas buyers find water hyacinth biomass batches harvested from Lake Victoria. There are currently ${availableBatches.length} available batches totaling ${totalKg}kg of biomass, located at: ${locations.length > 0 ? locations.join(", ") : "no locations right now"}. Answer questions about batch availability, locations, pricing, and how claiming works. Keep answers short and practical.`;

            const result = streamText({
                model: openai("gpt-3.5-turbo"),
                system: systemPrompt,
                messages: await convertToModelMessages(messages),
            });

            result.pipeUIMessageStreamToResponse(res);
            return;
        } catch (error) {
            return res.status(500).json({ success: false, message: "Chat unavailable" });
        }
    }
}

export const chatController = new ChatController();
