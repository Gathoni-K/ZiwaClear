import { batchService } from "../services/batchService";

export function startAutoBatchJob() {
    setInterval(async () => {
        try {
            console.log("Running auto-batch job...");
            await batchService.autoBatchSMS();
        } catch (error) {
            console.error("Auto-batch job failed:", error);
        }
    }, 60 * 60 * 1000); // Run every hour
}
