import { z } from "zod";

export const incomingSMSValidator = z.object({
    body: z.object({
        message: z.string().min(1).max(1600).transform(val => val.trim()),
        sender: z.string().regex(/^(?:\+254|0)[17]\d{8}$/, "Must be a valid Kenyan phone number"),
        received_at: z.string().datetime().optional()
    })
});

export const reprocessSMSValidator = z.object({
    params: z.object({
        id: z.string().uuid()
    })
});
