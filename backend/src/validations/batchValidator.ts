import { z } from "zod";

export const claimBatchValidator = z.object({
    params: z.object({
        id: z.string().uuid()
    }),
    body: z.object({
        buyerId: z.string().min(1)
    })
});

export const collectBatchValidator = z.object({
    params: z.object({
        id: z.string().uuid()
    }),
    body: z.object({
        qualityRating: z.number().int().min(1).max(5).optional(),
        notes: z.string().max(500).optional()
    })
});