import { Router } from "express";
import { listUsers, updateUserRole } from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

const router = Router();

router.use(protect, requireRole("admin"));

router.get("/", listUsers);
router.patch("/:id/role", updateUserRole);

export default router;
