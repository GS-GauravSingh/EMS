import { Router } from "express";
import {
  listEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employee.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

const router = Router();

router.use(protect);

router.get("/", listEmployees);
router.get("/:id", getEmployee);
router.post("/", requireRole("admin"), createEmployee);
router.put("/:id", requireRole("admin"), updateEmployee);
router.delete("/:id", requireRole("admin"), deleteEmployee);

export default router;
