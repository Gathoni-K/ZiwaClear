import { Request, Response } from "express";
import { db } from "../db";
import { landingSites } from "../db/schema";

export class LandingSiteController {
    public async getAll(req: Request, res: Response) {
        try {
            const sites = await db.select().from(landingSites);
            return res.json({ success: true, data: sites });
        } catch (error: any) {
            console.error("[LandingSiteController.getAll] Error:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
}

export const landingSiteController = new LandingSiteController();
