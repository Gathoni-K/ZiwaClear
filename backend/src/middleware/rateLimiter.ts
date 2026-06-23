import { Request, Response, NextFunction } from "express";

const rateLimits = new Map<string, { count: number, resetTime: number }>();

export const rateLimitSMS = (req: Request, res: Response, next: NextFunction) => {
    const from = req.body?.from;
    if (!from) return next();

    const now = Date.now();
    const windowMs = 60000;
    const maxRequests = 10;

    let limitData = rateLimits.get(from);

    if (!limitData || now > limitData.resetTime) {
        limitData = { count: 1, resetTime: now + windowMs };
        rateLimits.set(from, limitData);
    } else {
        limitData.count++;
        if (limitData.count > maxRequests) {
            return res.status(429).json({ success: false, message: "Too many requests. Please try again later." });
        }
    }

    next();
};