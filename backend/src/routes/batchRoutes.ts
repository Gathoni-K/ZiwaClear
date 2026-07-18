import { Router } from "express";
import { batchController } from "../controllers/batchController";
import { validateRequest } from "../middleware/requestValidator";
import { claimBatchValidator, collectBatchValidator } from "../validations/batchValidator";

export const batchRouter = Router();


batchRouter.get("/", batchController.listAvailable);
batchRouter.get("/all", batchController.list);
batchRouter.get("/impact", batchController.getImpact);
batchRouter.get("/impact/trend", batchController.getImpactTrend);
batchRouter.get("/price", batchController.getPrice);
batchRouter.get("/:id", batchController.getById);

batchRouter.post("/simulate-coverage-spike", batchController.simulateCoverageSpike);

// Action routes
batchRouter.post("/:id/claim", validateRequest(claimBatchValidator), batchController.claim);
batchRouter.post("/:id/collect", validateRequest(collectBatchValidator), batchController.collect);

// Admin
batchRouter.delete("/:id", batchController.delete);