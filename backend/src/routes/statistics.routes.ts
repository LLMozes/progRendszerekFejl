import { Router } from "express";
import { getHabitStatistics, getSummary } from "../controllers/statistics.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.use(requireAuth);

router.get("/summary", getSummary);
router.get("/habits/:habitId", getHabitStatistics);

export default router;
