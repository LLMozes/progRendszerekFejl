import { Router } from "express";
import { listCategories } from "../controllers/category.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", requireAuth, listCategories);

export default router;
