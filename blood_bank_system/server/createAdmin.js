// backend/createAdmin.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const User = require("./models/User");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
    const adminUser = new User({
      name: "Admin",
      email: "admin@gmail.com",
      password: "2311573",
      role: "admin",
    });

    await adminUser.save();
    console.log("✅ Admin user created!");
    process.exit();
  } catch (err) {
    console.error("❌ Error creating admin:", err);
    process.exit(1);
  }
};

createAdmin();