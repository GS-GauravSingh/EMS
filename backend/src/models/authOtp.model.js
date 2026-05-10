import crypto from "crypto";
import mongoose from "mongoose";

const authOtpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    purpose: {
      type: String,
      enum: ["register", "login", "forgot_password"],
      required: true,
      index: true,
    },
    otpHash: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: true },
    consumedAt: { type: Date, default: null, index: true },
    payload: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

authOtpSchema.statics.hashOtp = function hashOtp(otp) {
  return crypto.createHash("sha256").update(otp).digest("hex");
};

export const AuthOtp = mongoose.model("AuthOtp", authOtpSchema);
