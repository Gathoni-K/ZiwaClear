import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { db } from "./db";
import { sql } from "drizzle-orm";

import { smsRouter } from "./routes/smsRoutes";
import { batchRouter } from "./routes/batchRoutes";
import { chatRouter } from "./routes/chatRoutes";
import { landingSiteRouter } from "./routes/landingSiteRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
app.options(/.*/, cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({ status: "healthy", message: "Server is running perfectly" });
});

app.use("/api/sms", smsRouter);
app.use("/api/batches", batchRouter);
app.use("/api/chat", chatRouter);
app.use("/api/landing-sites", landingSiteRouter);

app.use((req: Request, res: Response) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({ success: false, message: err.message });
});

app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;