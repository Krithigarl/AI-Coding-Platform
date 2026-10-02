import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Course from "../models/Course";
import User from "../models/User";
import { defaultCourses } from "./coursesSeed";

const seedCourses = async () => {
  const slugs = defaultCourses.map((course) => course.slug);

  await Course.deleteMany({ slug: { $nin: slugs } });

  await Promise.all(
    defaultCourses.map((course) =>
      Course.updateOne({ slug: course.slug }, { $set: course }, { upsert: true })
    )
  );
};

const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@codegenius.com";
    const existing = await User.findOne({ email: adminEmail });
    if (!existing) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await User.create({
        fullname: "System Administrator",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      });
      console.log(`[Seed] Initialized Admin account: ${adminEmail} (password: admin123)`);
    } else if (existing.role !== "admin") {
      existing.role = "admin";
      await existing.save();
      console.log(`[Seed] Updated ${adminEmail} role to admin in MongoDB`);
    }
  } catch (err) {
    console.warn("Admin account initialization check:", err);
  }
};

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("MongoDB Connected");

    await seedCourses();
    console.log("Course syllabus synced to MongoDB");

    await seedAdmin();
  } catch (error) {
    console.log("Database Error", error);
    process.exit(1);
  }
};

export default connectDB;
