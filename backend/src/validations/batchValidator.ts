import { z } from "zod";

export const createBatchValidator = z.object({
    body: z.object({
        beachId: z.number().int().positive(),
        timeWindowStart: z.string().datetime(),
        timeWindowEnd: z.string().datetime()
    }).refine(data => new Date(data.timeWindowEnd) > new Date(data.timeWindowStart), {
        message: "timeWindowEnd must be after timeWindowStart",
        path: ["timeWindowEnd"]
    }).refine(data => {
        const start = new Date(data.timeWindowStart);
        const end = new Date(data.timeWindowEnd);
        const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        return diffHours <= 48;
    }, {
        message: "Time window cannot exceed 48 hours",
        path: ["timeWindowEnd"]
    })
});

export const addSMSBatchValidator = z.object({
    params: z.object({
        id: z.string().uuid()
    }),
    body: z.object({
        smsId: z.string().uuid()
    })
});

export const closeBatchValidator = z.object({
    params: z.object({
        id: z.string().uuid()
    })
});
