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

// Named POST routes must be declared BEFORE the /:id wildcard so Express
// never ambiguously captures a static segment as an :id parameter.
batchRouter.post("/simulate-coverage-spike", batchController.simulateCoverageSpike);

// Parameterized routes — keep last among route families
batchRouter.get("/:id", batchController.getById);

// Action routes
batchRouter.post("/:id/claim", validateRequest(claimBatchValidator), batchController.claim);
batchRouter.post("/:id/collect", validateRequest(collectBatchValidator), batchController.collect);

// Admin
batchRouter.delete("/:id", batchController.delete);