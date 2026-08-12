import { Router } from "express";
import { smsController } from "../controllers/smsController";
import { validateRequest } from "../middleware/requestValidator";
import { incomingSMSValidator } from "../validations/smsValidator";
import { rateLimitSMS } from "../middleware/rateLimiter";

export const smsRouter = Router();


smsRouter.post("/incoming", rateLimitSMS, validateRequest(incomingSMSValidator), smsController.receiveSMS);


smsRouter.get("/", smsController.listSMS);
smsRouter.get("/:id", smsController.getSMS);