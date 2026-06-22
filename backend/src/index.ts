import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { db } from "./db";
import { sql } from "drizzle-orm";

// Import real routes
import { smsRouter } from "./routes/smsRoutes";
import { batchRouter } from "./routes/batchRoutes";
import { chatRouter } from "./routes/chatRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Africa's Talking may send form-encoded

// Health check
app.get("/health", async (req, res) => {
    try {
        await db.execute(sql`SELECT 1`);
        res.json({ status: "healthy", database: "connected" });
    } catch (error) {
        res.status(500).json({ status: "unhealthy", error: "Database connection failed" });
    }
});

// Mount routes
app.use("/api/sms", smsRouter);
app.use("/api/batches", batchRouter);
app.use("/api/chat", chatRouter);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health: http://localhost:${PORT}/health`);
    console.log(`SMS webhook: http://localhost:${PORT}/api/sms/incoming`);
    console.log(`Batches: http://localhost:${PORT}/api/batches`);
    console.log(`Impact: http://localhost:${PORT}/api/batches/impact`);
    console.log(`Price: http://localhost:${PORT}/api/batches/price`);
    console.log(`Chat: http://localhost:${PORT}/api/chat`);
});

export default app;