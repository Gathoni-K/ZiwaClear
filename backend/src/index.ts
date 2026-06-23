import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { db } from "./db";
import { sql } from "drizzle-orm";


import { smsRouter } from "./routes/smsRoutes";
import { batchRouter } from "./routes/batchRoutes";
import { chatRouter } from "./routes/chatRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/health", (req, res) => {

    res.status(200).json({ status: "healthy", message: "Server is running perfectly" });
});


app.use("/api/sms", smsRouter);
app.use("/api/batches", batchRouter);
app.use("/api/chat", chatRouter);


app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});


app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health: http://localhost:${PORT}/health`);
    console.log(`SMS webhook: http://localhost:${PORT}/api/sms/incoming`);
    console.log(`Batches: http://localhost:${PORT}/api/batches`);
    console.log(`Impact: http://localhost:${PORT}/api/batches/impact`);
    console.log(`Price: http://localhost:${PORT}/api/batches/price`);
    console.log(`Chat: http://localhost:${PORT}/api/chat`);
});

export default app;