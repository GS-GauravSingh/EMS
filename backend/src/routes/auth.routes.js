import { Router } from "express";
import {
  requestRegisterOtp,
  verifyRegisterOtp,
  requestLoginOtp,
  verifyLoginOtp,
  logout,
  me,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register/request-otp", requestRegisterOtp);
router.post("/register/verify-otp", verifyRegisterOtp);
router.post("/login/request-otp", requestLoginOtp);
router.post("/login/verify-otp", verifyLoginOtp);
router.post("/logout", logout);
router.get("/me", protect, me);

export default router;
