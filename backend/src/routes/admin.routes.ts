import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  deleteUser,
  listCategories,
  listSystemLogs,
  listUsers,
  updateCategory,
  updateUserRole,
} from "../controllers/admin.controller";
import { requireAdmin } from "../middlewares/auth.middleware";

const router = Router();

router.use(requireAdmin);

router.get("/users", listUsers);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

router.get("/categories", listCategories);
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

router.get("/system-logs", listSystemLogs);

export default router;
