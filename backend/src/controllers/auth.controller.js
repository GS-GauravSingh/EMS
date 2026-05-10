import { User } from "../models/user.model.js";
import { AuthOtp } from "../models/authOtp.model.js";
import { signToken } from "../config/jwt.js";
import { env } from "../helpers/env.js";
import { AppError } from "../middlewares/error.middleware.js";
import { sendOtpEmail } from "../services/email.service.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const OTP_DIGITS = 6;

function generateOtp() {
  return String(Math.floor(Math.random() * 10 ** OTP_DIGITS)).padStart(OTP_DIGITS, "0");
}

function getExpiry(minutes) {
  return new Date(Date.now() + minutes * 60 * 1000);
}

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

async function createAndSendOtp({ email, purpose, payload, otpTtlMinutes }) {
  const normalizedEmail = email.toLowerCase().trim();
  const otp = generateOtp();
  const otpHash = AuthOtp.hashOtp(otp);

  await AuthOtp.create({
    email: normalizedEmail,
    purpose,
    otpHash,
    expiresAt: getExpiry(otpTtlMinutes),
    payload,
  });

  await sendOtpEmail({ to: normalizedEmail, otp, purpose });
}

async function verifyOtp({ email, purpose, otp }) {
  const normalizedEmail = email.toLowerCase().trim();
  const otpRecord = await AuthOtp.findOne({
    email: normalizedEmail,
    purpose,
    consumedAt: null,
  }).sort({ createdAt: -1 });

  if (!otpRecord) {
    throw new AppError("OTP not found. Please request a new OTP.", 400);
  }

  if (otpRecord.expiresAt < new Date()) {
    throw new AppError("OTP has expired. Please request a new OTP.", 400);
  }

  const otpHash = AuthOtp.hashOtp(otp);
  if (otpHash !== otpRecord.otpHash) {
    throw new AppError("Invalid OTP", 401);
  }

  otpRecord.consumedAt = new Date();
  await otpRecord.save();

  return otpRecord;
}

export async function requestRegisterOtp(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      throw new AppError("Please provide name, email, and password");
    }

    const normalizedEmail = email.toLowerCase().trim();
    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) {
      throw new AppError("Email already registered", 400);
    }

    await createAndSendOtp({
      email: normalizedEmail,
      purpose: "register",
      payload: { name: name.trim(), password },
      otpTtlMinutes: env.otpTtlMinutes,
    });

    res.json({ success: true, message: "OTP sent to your email" });
  } catch (err) {
    next(err);
  }
}

export async function verifyRegisterOtp(req, res, next) {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      throw new AppError("Please provide email and OTP");
    }

    const otpRecord = await verifyOtp({ email, purpose: "register", otp });

    const existing = await User.findOne({ email: otpRecord.email });
    if (existing) {
      throw new AppError("Email already registered", 400);
    }
    if (!otpRecord.payload?.name || !otpRecord.payload?.password) {
      throw new AppError("Registration OTP payload is invalid. Please try again.", 400);
    }

    const count = await User.countDocuments();
    const userRole = count === 0 ? "admin" : "employee";

    const user = await User.create({
      name: otpRecord.payload?.name,
      email: otpRecord.email,
      password: otpRecord.payload?.password,
      role: userRole,
    });

    const token = signToken({ id: user._id.toString(), role: user.role });
    res.cookie("token", token, COOKIE_OPTIONS);

    res.status(201).json({ success: true, user: publicUser(user) });
  } catch (err) {
    next(err);
  }
}

export async function requestLoginOtp(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new AppError("Please provide email and password");
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select("+password");
    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const passwordOk = await user.comparePassword(password);
    if (!passwordOk) {
      throw new AppError("Invalid credentials", 401);
    }

    await createAndSendOtp({
      email: normalizedEmail,
      purpose: "login",
      payload: { userId: user._id.toString() },
      otpTtlMinutes: env.otpTtlMinutes,
    });

    res.json({ success: true, message: "OTP sent to your email" });
  } catch (err) {
    next(err);
  }
}

export async function verifyLoginOtp(req, res, next) {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      throw new AppError("Please provide email and OTP");
    }

    const otpRecord = await verifyOtp({ email, purpose: "login", otp });
    if (!otpRecord.payload?.userId) {
      throw new AppError("Login OTP payload is invalid. Please try again.", 400);
    }

    const user = await User.findById(otpRecord.payload?.userId);
    if (!user || user.email !== otpRecord.email) {
      throw new AppError("Invalid login request. Please try again.", 401);
    }

    const token = signToken({ id: user._id.toString(), role: user.role });
    res.cookie("token", token, COOKIE_OPTIONS);

    res.json({ success: true, user: publicUser(user) });
  } catch (err) {
    next(err);
  }
}

export async function requestForgotPasswordOtp(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) {
      throw new AppError("Please provide email", 400);
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select("_id email");

    // Return same response even when user does not exist, to avoid email enumeration.
    if (user) {
      await createAndSendOtp({
        email: normalizedEmail,
        purpose: "forgot_password",
        payload: { userId: user._id.toString() },
        otpTtlMinutes: env.otpTtlMinutes,
      });
    }

    res.json({
      success: true,
      message: "If the email is registered, an OTP has been sent",
    });
  } catch (err) {
    next(err);
  }
}

export async function resetPasswordWithOtp(req, res, next) {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      throw new AppError("Please provide email, OTP and new password", 400);
    }
    if (String(newPassword).length < 6) {
      throw new AppError("Password must be at least 6 characters long", 400);
    }

    const otpRecord = await verifyOtp({ email, purpose: "forgot_password", otp });
    if (!otpRecord.payload?.userId) {
      throw new AppError("Reset OTP payload is invalid. Please try again.", 400);
    }

    const user = await User.findById(otpRecord.payload.userId).select("+password");
    if (!user || user.email !== otpRecord.email) {
      throw new AppError("Invalid reset request. Please try again.", 401);
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: "Password reset successful. Please login." });
  } catch (err) {
    next(err);
  }
}

export async function logout(_req, res) {
  res.clearCookie("token", { ...COOKIE_OPTIONS, maxAge: 0 });
  res.json({ success: true, message: "Logged out" });
}

export async function me(req, res) {
  res.json({ success: true, user: publicUser(req.user) });
}
