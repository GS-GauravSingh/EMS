import { Router } from "express";
import {
  getDailyAttendance,
  markDailyAttendance,
  getAttendanceHistory,
  markSelfAttendance,
  getSelfAttendanceHistory,
} from "../controllers/attendance.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

const router = Router();

router.use(protect);

router.post("/self", markSelfAttendance);
router.get("/self/history", getSelfAttendanceHistory);

router.get("/daily", requireRole("admin"), getDailyAttendance);
router.post("/daily", requireRole("admin"), markDailyAttendance);
router.get("/history", requireRole("admin"), getAttendanceHistory);

export default router;
