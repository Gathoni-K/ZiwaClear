import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { routes as stubRoutes } from "./routes/stubs";
import { db } from "./db";
import { sql } from "drizzle-orm";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.get("/health", async (req, res) => {
    try {

        await db.execute(sql`SELECT 1`);

        res.json({ status: "healthy", database: "connected" });
    } catch (error) {
        res.status(500).json({ status: "unhealthy", error: "Database connection failed" });
    }
});

app.use(stubRoutes);

app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});