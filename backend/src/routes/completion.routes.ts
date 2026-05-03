import { Router } from "express";
import {
  createCompletion,
  deleteCompletion,
  listCompletions,
  updateCompletion,
} from "../controllers/completion.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.use(requireAuth);

router.get("/habits/:habitId/completions", listCompletions);
router.post("/habits/:habitId/completions", createCompletion);
router.put("/completions/:id", updateCompletion);
router.delete("/completions/:id", deleteCompletion);

export default router;
