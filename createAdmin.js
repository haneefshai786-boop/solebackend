import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";

dotenv.config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // ❗ Delete existing admin (optional but recommended)
    await Admin.deleteMany({});

    const admin = new Admin({
      name: "Super Admin",
      email: "admin@example.com",
      password: "Admin@123" // 🔥 PLAIN password (will be hashed by model)
    });

    await admin.save();

    console.log("✅ Admin created successfully");
    console.log({
      name: admin.name,
      email: admin.email,
      password: "Admin@123"
    });

    process.exit();
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

createAdmin();
