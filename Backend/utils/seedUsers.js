import dotenv from "dotenv";

dotenv.config();
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import connectDB from "../config/db.js";
import User from "../models/User.js";

const run = async () => {
  await connectDB(process.env.MONGO_URI);
  await User.deleteMany({});
  const salt = await bcrypt.genSalt(10);
  const adminPass = await bcrypt.hash("admin123", salt);
  const empPass = await bcrypt.hash("employee123", salt);

  await User.create([
    {
      name: "Admin User",
      email: "admin@example.com",
      password: adminPass,
      role: "admin",
    },
    {
      name: "Employee User",
      email: "employee@example.com",
      password: empPass,
      role: "employee",
    },
  ]);
  console.log(
    "Seeded users: admin@example.com/admin123 and employee@example.com/employee123"
  );
  mongoose.disconnect();
};

run().catch(err => {
  console.error(err);
  mongoose.disconnect();
});
