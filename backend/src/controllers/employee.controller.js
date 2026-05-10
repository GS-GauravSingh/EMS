import { Employee } from "../models/employee.model.js";
import { AppError } from "../middlewares/error.middleware.js";

export async function listEmployees(_req, res, next) {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json({ success: true, data: employees });
  } catch (err) {
    next(err);
  }
}

export async function getEmployee(req, res, next) {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      throw new AppError("Employee not found", 404);
    }
    res.json({ success: true, data: employee });
  } catch (err) {
    next(err);
  }
}

export async function createEmployee(req, res, next) {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      department,
      position,
      salary,
      hireDate,
    } = req.body;
    if (!firstName || !lastName || !email || !department || !position || salary == null || !hireDate) {
      throw new AppError("Missing required fields");
    }
    const exists = await Employee.findOne({ email });
    if (exists) {
      throw new AppError("Employee with this email already exists");
    }
    const employee = await Employee.create({
      firstName,
      lastName,
      email,
      phone: phone || "",
      department,
      position,
      salary: Number(salary),
      hireDate,
      createdBy: req.user._id,
    });
    res.status(201).json({ success: true, data: employee });
  } catch (err) {
    next(err);
  }
}

export async function updateEmployee(req, res, next) {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      throw new AppError("Employee not found", 404);
    }
    const {
      firstName,
      lastName,
      email,
      phone,
      department,
      position,
      salary,
      hireDate,
    } = req.body;
    if (email && email !== employee.email) {
      const taken = await Employee.findOne({ email });
      if (taken) {
        throw new AppError("Email already in use");
      }
    }
    Object.assign(employee, {
      ...(firstName != null && { firstName }),
      ...(lastName != null && { lastName }),
      ...(email != null && { email }),
      ...(phone != null && { phone }),
      ...(department != null && { department }),
      ...(position != null && { position }),
      ...(salary != null && { salary: Number(salary) }),
      ...(hireDate != null && { hireDate }),
    });
    await employee.save();
    res.json({ success: true, data: employee });
  } catch (err) {
    next(err);
  }
}

export async function deleteEmployee(req, res, next) {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      throw new AppError("Employee not found", 404);
    }
    res.json({ success: true, message: "Employee removed" });
  } catch (err) {
    next(err);
  }
}
