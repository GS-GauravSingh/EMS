import { AppError } from "./error.middleware.js";

export function requireRole(...roles) {
  return (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError("Forbidden: insufficient permissions", 403));
    }
    next();
  };
}
