import { Router } from "express";
import {
  createHabit,
  deleteHabit,
  getHabit,
  listHabits,
  updateHabit,
} from "../controllers/habit.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.use(requireAuth);

router.get("/", listHabits);
router.get("/:id", getHabit);
router.post("/", createHabit);
router.put("/:id", updateHabit);
router.delete("/:id", deleteHabit);

export default router;
