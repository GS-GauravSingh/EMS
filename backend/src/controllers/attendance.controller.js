import { Attendance } from "../models/attendance.model.js";
import { Employee } from "../models/employee.model.js";
import { AppError } from "../middlewares/error.middleware.js";

function startOfDay(dateInput) {
  const d = new Date(dateInput || Date.now());
  if (Number.isNaN(d.getTime())) {
    throw new AppError("Invalid date value", 400);
  }
  d.setHours(0, 0, 0, 0);
  return d;
}

async function getEmployeeForLoggedInUser(user) {
  const employee = await Employee.findOne({ email: user.email }).select(
    "firstName lastName email department position"
  );
  if (!employee) {
    throw new AppError(
      "No employee profile found for your account. Contact admin to map your email.",
      404
    );
  }
  return employee;
}

export async function getDailyAttendance(req, res, next) {
  try {
    const day = startOfDay(req.query.date);
    const nextDay = new Date(day);
    nextDay.setDate(nextDay.getDate() + 1);

    const records = await Attendance.find({ date: { $gte: day, $lt: nextDay } })
      .populate("employee", "firstName lastName email department position")
      .sort({ createdAt: -1 });

    res.json({ success: true, date: day, data: records });
  } catch (err) {
    next(err);
  }
}

export async function markDailyAttendance(req, res, next) {
  try {
    const day = startOfDay(req.body.date);
    const records = Array.isArray(req.body.records) ? req.body.records : [];
    if (records.length === 0) {
      throw new AppError("Please provide attendance records", 400);
    }

    const employeeIds = records.map((record) => record.employeeId);
    const employeeCount = await Employee.countDocuments({ _id: { $in: employeeIds } });
    if (employeeCount !== employeeIds.length) {
      throw new AppError("One or more employees do not exist", 400);
    }

    const ops = records.map((record) => {
      if (!["present", "absent"].includes(record.status)) {
        throw new AppError("Attendance status must be present or absent", 400);
      }
      return {
        updateOne: {
          filter: { employee: record.employeeId, date: day },
          update: {
            $set: {
              status: record.status,
              markedBy: req.user._id,
            },
          },
          upsert: true,
        },
      };
    });

    await Attendance.bulkWrite(ops);
    res.json({ success: true, message: "Attendance saved successfully" });
  } catch (err) {
    next(err);
  }
}

export async function getAttendanceHistory(req, res, next) {
  try {
    const { employeeId, from, to } = req.query;
    if (!employeeId) {
      throw new AppError("employeeId is required", 400);
    }

    const employee = await Employee.findById(employeeId).select(
      "firstName lastName email department position"
    );
    if (!employee) {
      throw new AppError("Employee not found", 404);
    }

    const filter = { employee: employeeId };
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = startOfDay(from);
      if (to) {
        const toDay = startOfDay(to);
        const nextDay = new Date(toDay);
        nextDay.setDate(nextDay.getDate() + 1);
        filter.date.$lt = nextDay;
      }
    }

    const history = await Attendance.find(filter)
      .sort({ date: -1 })
      .populate("markedBy", "name email");

    res.json({ success: true, employee, data: history });
  } catch (err) {
    next(err);
  }
}

export async function markSelfAttendance(req, res, next) {
  try {
    const day = startOfDay(req.body.date || Date.now());
    const status = req.body.status;
    if (!["present", "absent"].includes(status)) {
      throw new AppError("Attendance status must be present or absent", 400);
    }

    const employee = await getEmployeeForLoggedInUser(req.user);

    await Attendance.findOneAndUpdate(
      { employee: employee._id, date: day },
      {
        $set: {
          status,
          markedBy: req.user._id,
        },
      },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: `Attendance marked as ${status} for ${day.toISOString().slice(0, 10)}`,
    });
  } catch (err) {
    next(err);
  }
}

export async function getSelfAttendanceHistory(req, res, next) {
  try {
    const employee = await getEmployeeForLoggedInUser(req.user);
    const { from, to } = req.query;

    const filter = { employee: employee._id };
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = startOfDay(from);
      if (to) {
        const toDay = startOfDay(to);
        const nextDay = new Date(toDay);
        nextDay.setDate(nextDay.getDate() + 1);
        filter.date.$lt = nextDay;
      }
    }

    const history = await Attendance.find(filter)
      .sort({ date: -1 })
      .populate("markedBy", "name email");

    res.json({ success: true, employee, data: history });
  } catch (err) {
    next(err);
  }
}
