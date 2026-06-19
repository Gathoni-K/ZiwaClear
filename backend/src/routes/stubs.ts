import { Router } from "express";

export const routes = Router();

routes.get("/api/batches", (req, res) => {
    res.json({
        success: true,
        data: [
            {
                id: 1,
                harvesterId: 1,
                weightKg: "45.5",
                locationCoordinates: "-0.1432,34.7391",
                status: "available",
                createdAt: new Date().toISOString(),
            },
            {
                id: 2,
                harvesterId: 1,
                weightKg: "120.0",
                locationCoordinates: "-0.1032,34.7521",
                status: "available",
                createdAt: new Date().toISOString(),
            },
            {
                id: 3,
                harvesterId: 1,
                weightKg: "75.2",
                locationCoordinates: "-0.1194,34.7314",
                status: "claimed",
                createdAt: new Date().toISOString(),
            }
        ],
    });
});

routes.get("/api/transactions", (req, res) => {
    res.json({
        success: true,
        data: [
            {
                id: 1,
                batchId: 3,
                buyerId: 1,
                payoutAmount: "1500.00",
                mpesaReceiptNumber: "QWE123RTY",
                status: "completed",
                createdAt: new Date().toISOString(),
            }
        ],
    });
});

routes.get("/api/sms", (req, res) => {
    res.json({
        success: true,
        data: [
            {
                id: 1,
                senderPhone: "+254712345678",
                rawMessage: "I have 45kg of water hyacinth at Dunga",
                parsedSuccessfully: true,
                createdAt: new Date().toISOString(),
            }
        ],
    });
});