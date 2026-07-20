import { z } from "zod";

export const impactTagEnum = z.enum([
    "navigation_blockage",
    "fishing_disruption",
    "water_intake_blockage",
    "health_risk",
    "livelihood_impact",
]);

export const scaleEstimateSchema = z.object({
    scale_type: z.enum([
        "gunia", "toroli", "mkokoteni", "mtumbwi",
        "sese", "pickup", "canter", "fuso", "direct_kg",
    ]).nullable(),
    raw_value: z.number().nullable(),
});

// What the LLM is allowed to produce
export const llmExtractionSchema = z.object({
    location_raw: z.string().nullable().optional(),
    location: z.string().nullable().optional(),
    scale_estimate: scaleEstimateSchema.nullable().optional(),
    quality: z.enum(["fresh", "dry", "mixed", "decomposed"]).nullable().optional(),
    impact_tags: z.array(impactTagEnum).default([]),
    summary: z.string().nullable().optional(),
    additional_notes: z.string().nullable().optional(),
    confidence_score: z.number().min(0).max(1).default(0.8),
});

// Full record, after quantity_kg/urgency_level are computed downstream
export const smsParserSchema = llmExtractionSchema.extend({
    quantity_kg: z.number().nullable().optional(),
    quantity_estimated: z.boolean().default(false),
    unit: z.string().default("kg"),
    urgency_level: z.enum(["low", "medium", "high"]).nullable().optional(),
    extracted_at: z.string().datetime().default(new Date().toISOString()),
});

export type ParsedSMSData = z.infer<typeof smsParserSchema>;
export type LLMExtraction = z.infer<typeof llmExtractionSchema>;
export type ScaleEstimate = z.infer<typeof scaleEstimateSchema>;