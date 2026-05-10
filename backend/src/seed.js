import mongoose from "mongoose";
import { env } from "./helpers/env.js";
import { User } from "./models/user.model.js";
import { Employee } from "./models/employee.model.js";

const DEPARTMENTS = ["Engineering", "HR", "Finance", "Sales", "Marketing", "Operations"];
const POSITIONS = [
  "Software Engineer",
  "HR Executive",
  "Accountant",
  "Sales Executive",
  "Marketing Specialist",
  "Operations Analyst",
];

function makeUserSeedData() {
  const users = [
    {
      name: "System Admin",
      email: "emsAdmin@yopmail.com",
      password: "password@123",
      role: "admin",
    },
  ];

  for (let i = 1; i <= 20; i += 1) {
    users.push({
      name: `Employee User ${i}`,
      email: `user${i}@yopmail.com`,
      password: "password@123",
      role: i % 7 === 0 ? "admin" : "employee",
    });
  }
  return users;
}

function makeEmployeeSeedData(createdById) {
  const employees = [];
  for (let i = 1; i <= 20; i += 1) {
    const department = DEPARTMENTS[(i - 1) % DEPARTMENTS.length];
    const position = POSITIONS[(i - 1) % POSITIONS.length];
    const salary = 28000 + i * 1700;
    const hireDate = new Date(2022, (i * 2) % 12, ((i * 3) % 27) + 1);

    employees.push({
      firstName: `First${i}`,
      lastName: `Last${i}`,
      email: `employee${i}@yopmail.com`,
      phone: `+91-90000${String(i).padStart(5, "0")}`,
      department,
      position,
      salary,
      hireDate,
      createdBy: createdById,
    });
  }
  return employees;
}

async function seed() {
  await mongoose.connect(env.mongoUri);
  const seededUsers = makeUserSeedData();
  const existingUserEmails = seededUsers.map((u) => u.email);
  const existingUsers = await User.find({ email: { $in: existingUserEmails } }).select(
    "email _id"
  );
  const existingEmailSet = new Set(existingUsers.map((u) => u.email));

  const usersToCreate = seededUsers.filter((u) => !existingEmailSet.has(u.email));
  if (usersToCreate.length > 0) {
    await User.create(usersToCreate);
  }

  const admin = await User.findOne({ email: "emsAdmin@yopmail.com" }).select("_id");
  if (!admin) {
    throw new Error("Admin user missing after seeding users");
  }

  const seededEmployees = makeEmployeeSeedData(admin._id);
  const employeeEmails = seededEmployees.map((e) => e.email);
  const existingEmployees = await Employee.find({
    email: { $in: employeeEmails },
  }).select("email");
  const existingEmployeeEmailSet = new Set(existingEmployees.map((e) => e.email));

  const employeesToCreate = seededEmployees.filter(
    (e) => !existingEmployeeEmailSet.has(e.email)
  );
  if (employeesToCreate.length > 0) {
    await Employee.create(employeesToCreate);
  }

  const totalUsers = await User.countDocuments();
  const totalEmployees = await Employee.countDocuments();

  console.log("Seed completed successfully.");
  console.log(`Users created this run: ${usersToCreate.length}`);
  console.log(`Employees created this run: ${employeesToCreate.length}`);
  console.log(`Total users in DB: ${totalUsers}`);
  console.log(`Total employees in DB: ${totalEmployees}`);
  console.log("");
  console.log("Sample credentials:");
  console.log("  Admin: emsAdmin@yopmail.com / password@123");
  console.log("  User: user1@yopmail.com / password@123");

  if (usersToCreate.length === 0 && employeesToCreate.length === 0) {
    console.log("Nothing new was inserted (seed data already exists).");
  }

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
