import { Router } from "express";
import { smsController } from "../controllers/smsController";
import { validateRequest } from "../middleware/requestValidator";
import { incomingSMSValidator } from "../validations/smsValidator";
import { rateLimitSMS } from "../middleware/rateLimiter";

export const smsRouter = Router();

// Africa's Talking webhook — must be public. AT doesn't send API keys.
smsRouter.post("/incoming", rateLimitSMS, validateRequest(incomingSMSValidator), smsController.receiveSMS);

// Internal routes — optionally protect these
smsRouter.get("/", smsController.listSMS);
smsRouter.get("/:id", smsController.getSMS);