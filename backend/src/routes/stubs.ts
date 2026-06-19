import { Router } from "express";
import { db } from "../db";
import { biomassBatches } from "../db/schema/biomassBatches";
import { eq } from "drizzle-orm";

export const routes = Router();

// 1. GET /api/batches → Fetch all 'available' batches from the live DB
routes.get("/api/batches", async (req, res) => {
    try {
        const batches = await db
            .select()
            .from(biomassBatches)
            .where(eq(biomassBatches.status, "available"));

        res.json({
            success: true,
            data: batches,
        });
    } catch (error) {
        console.error("Error fetching batches:", error);
        res.status(500).json({ success: false, error: "Failed to fetch database records" });
    }
});

// 2. GET /api/batches/:id → Stubbed yield predictions
routes.get("/api/batches/:id", (req, res) => {
    const { id } = req.params;

    res.json({
        success: true,
        data: {
            batchId: parseInt(id),
            yieldPredictions: {
                estimatedBiogasM3: 45.2,
                estimatedFertilizerKg: 12.5,
                moistureContentPercentage: 88,
            },
        },
    });
});

// 3. GET /api/impact → Stubbed environmental impact metrics
routes.get("/api/impact", (req, res) => {
    res.json({
        success: true,
        data: {
            totalTonnes: 0,
            lakeAreaClearedM2: 0,
            co2eAvoided: 0,
        },
    });
});

// 4. GET /api/price → Stubbed constant price
routes.get("/api/price", (req, res) => {
    res.json({
        success: true,
        data: {
            price_kes_per_kg: 9,
        },
    });
});