import { Router } from "express";
import { smsController } from "../controllers/smsController";
import { validateRequest } from "../middleware/requestValidator";
import { incomingSMSValidator, reprocessSMSValidator } from "../validations/smsValidator";
import { rateLimitSMS } from "../middleware/rateLimiter";
import { authenticateAPIKey } from "../middleware/auth";

export const smsRouter = Router();

smsRouter.post("/incoming", authenticateAPIKey, rateLimitSMS, validateRequest(incomingSMSValidator), smsController.receiveSMS);
smsRouter.get("/", authenticateAPIKey, smsController.listSMS);
smsRouter.get("/stats", authenticateAPIKey, smsController.getStats);
smsRouter.get("/:id", authenticateAPIKey, smsController.getSMS);
smsRouter.post("/:id/reprocess", authenticateAPIKey, validateRequest(reprocessSMSValidator), smsController.reprocess);
smsRouter.delete("/cleanup", authenticateAPIKey, smsController.cleanup);
