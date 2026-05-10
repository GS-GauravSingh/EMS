import { verifyToken } from "../config/jwt.js";
import { User } from "../models/user.model.js";
import { AppError } from "./error.middleware.js";

export async function protect(req, _res, next) {
  try {
    const token = req.cookies?.token;
    if (!token) {
      throw new AppError("Not authorized, no token", 401);
    }
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      throw new AppError("User not found", 401);
    }
    req.user = user;
    next();
  } catch {
    next(new AppError("Not authorized, invalid token", 401));
  }
}
