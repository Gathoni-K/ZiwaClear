import { Router } from "express";
import { landingSiteController } from "../controllers/landingSiteController";

export const landingSiteRouter = Router();

landingSiteRouter.get("/", landingSiteController.getAll);
