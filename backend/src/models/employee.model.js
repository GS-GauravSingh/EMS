import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, trim: true, default: "" },
    department: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    salary: { type: Number, required: true, min: 0 },
    hireDate: { type: Date, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Employee = mongoose.model("Employee", employeeSchema);
