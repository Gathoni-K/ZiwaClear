import { Router } from "express";
import { landingSiteController } from "../controllers/landingSiteController";

export const landingSiteRouter = Router();

landingSiteRouter.get("/", landingSiteController.getAll);

// Static named routes before the /:id wildcard.
landingSiteRouter.get("/metrics", landingSiteController.getMetrics);

landingSiteRouter.get("/:id", landingSiteController.getOne);
landingSiteRouter.post("/:id/evaluate-risk", landingSiteController.evaluateRisk);
