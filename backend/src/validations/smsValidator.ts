import { z } from "zod";

export const incomingSMSValidator = z.object({
    body: z.object({
        text: z.string().min(1).max(1600).transform(val => val.trim()),
        from: z.string().min(1),
        date: z.string().optional()
    })
});