import { Router } from "express";
import { batchController } from "../controllers/batchController";
import { validateRequest } from "../middleware/requestValidator";
import { createBatchValidator, addSMSBatchValidator, closeBatchValidator } from "../validations/batchValidator";
import { authenticateAPIKey } from "../middleware/auth";

export const batchRouter = Router();

batchRouter.post("/", authenticateAPIKey, validateRequest(createBatchValidator), batchController.create);
batchRouter.get("/", authenticateAPIKey, batchController.list);
batchRouter.post("/auto", authenticateAPIKey, batchController.autoBatch);
batchRouter.get("/:id", authenticateAPIKey, batchController.getById);
batchRouter.patch("/:id/close", authenticateAPIKey, validateRequest(closeBatchValidator), batchController.close);
batchRouter.get("/:id/aggregation", authenticateAPIKey, batchController.getAggregation);
batchRouter.post("/:id/add-sms", authenticateAPIKey, validateRequest(addSMSBatchValidator), batchController.addSMS);
batchRouter.delete("/:id", authenticateAPIKey, batchController.delete);
