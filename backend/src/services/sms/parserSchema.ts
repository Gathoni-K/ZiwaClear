import { z } from "zod";

export const smsParserSchema = z.object({
  beach_name: z.string().nullable().optional(),
  fish_species: z.array(z.string()).default([]),
  catch_total_kg: z.number().nullable().optional(),
  price_per_kg_ksh: z.number().nullable().optional(),
  weather_condition: z.string().nullable().optional(),
  boat_count: z.number().nullable().optional(),
  fishing_method: z.string().nullable().optional(),
  additional_notes: z.string().nullable().optional(),
  confidence_score: z.number().min(0).max(1),
  extracted_at: z.string().datetime()
});

export type ParsedSMSData = z.infer<typeof smsParserSchema>;
