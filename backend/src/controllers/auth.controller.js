import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { signToken } from "../config/jwt.js";
import { AppError } from "../middlewares/error.middleware.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      throw new AppError("Please provide name, email, and password");
    }
    const exists = await User.findOne({ email });
    if (exists) {
      throw new AppError("Email already registered");
    }
    const count = await User.countDocuments();
    const userRole = count === 0 ? "admin" : "employee";
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
      role: userRole,
    });
    const token = signToken({ id: user._id.toString(), role: user.role });
    res.cookie("token", token, COOKIE_OPTIONS);
    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new AppError("Please provide email and password");
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new AppError("Invalid credentials", 401);
    }
    const token = signToken({ id: user._id.toString(), role: user.role });
    res.cookie("token", token, COOKIE_OPTIONS);
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function logout(_req, res) {
  res.clearCookie("token", { ...COOKIE_OPTIONS, maxAge: 0 });
  res.json({ success: true, message: "Logged out" });
}

export async function me(req, res) {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
}
