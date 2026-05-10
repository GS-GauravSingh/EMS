import { Router } from "express";
import {
  requestRegisterOtp,
  verifyRegisterOtp,
  requestLoginOtp,
  verifyLoginOtp,
  requestForgotPasswordOtp,
  resetPasswordWithOtp,
  logout,
  me,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register/request-otp", requestRegisterOtp);
router.post("/register/verify-otp", verifyRegisterOtp);
router.post("/login/request-otp", requestLoginOtp);
router.post("/login/verify-otp", verifyLoginOtp);
router.post("/forgot-password/request-otp", requestForgotPasswordOtp);
router.post("/forgot-password/reset", resetPasswordWithOtp);
router.post("/logout", logout);
router.get("/me", protect, me);

export default router;
