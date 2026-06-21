import { z } from "zod";

export const smsParserSchema = z.object({
    location: z.string().nullable().optional(),
    quantity_kg: z.number().nullable().optional(),
    unit: z.string().default("kg"),
    additional_notes: z.string().nullable().optional(),
    confidence_score: z.number().min(0).max(1).default(0.8),
    extracted_at: z.string().datetime().default(new Date().toISOString())
});

export type ParsedSMSData = z.infer<typeof smsParserSchema>;