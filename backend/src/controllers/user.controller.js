import { User } from "../models/user.model.js";
import { AppError } from "../middlewares/error.middleware.js";

function toPublicUser(user, firstUserId) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    isFirstUser: firstUserId ? String(user._id) === String(firstUserId) : false,
  };
}

export async function listUsers(_req, res, next) {
  try {
    const [users, firstUser] = await Promise.all([
      User.find().sort({ createdAt: 1 }),
      User.findOne().sort({ createdAt: 1 }).select("_id"),
    ]);

    const data = users.map((user) => toPublicUser(user, firstUser?._id));
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function updateUserRole(req, res, next) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["admin", "employee"].includes(role)) {
      throw new AppError("Role must be either admin or employee", 400);
    }

    const [targetUser, firstUser] = await Promise.all([
      User.findById(id),
      User.findOne().sort({ createdAt: 1 }).select("_id"),
    ]);

    if (!targetUser) {
      throw new AppError("User not found", 404);
    }

    if (firstUser && String(targetUser._id) === String(firstUser._id)) {
      throw new AppError("The first registered admin role cannot be changed", 403);
    }

    targetUser.role = role;
    await targetUser.save();

    res.json({
      success: true,
      message: "User role updated successfully",
      data: toPublicUser(targetUser, firstUser?._id),
    });
  } catch (err) {
    next(err);
  }
}
