import mongoose from "mongoose";
import { env } from "./helpers/env.js";
import { User } from "./models/user.model.js";

async function seed() {
  await mongoose.connect(env.mongoUri);
  const email = "admin@ems.local";
  const exists = await User.findOne({ email });
  if (exists) {
    console.log("Admin already exists, skipping seed.");
    await mongoose.disconnect();
    return;
  }

  await User.create({
    name: "System Admin",
    email,
    password: "admin123",
    role: "admin",
  });

  console.log("Seeded admin user:");
  console.log(`  Email: ${email}`);
  console.log("  Password: admin123");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
