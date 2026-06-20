import { Request, Response, NextFunction } from "express";

export const authenticateAPIKey = (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.header("x-api-key");
    if (!apiKey || apiKey !== process.env.SMS_API_KEY) {
        return res.status(401).json({ success: false, message: "Unauthorized: Invalid or missing API key" });
    }
    next();
};
