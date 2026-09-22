import mongoose from "mongoose";
import Course from "../models/Course";
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

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("MongoDB Connected");

    await seedCourses();
    console.log("Course syllabus synced to MongoDB");
  } catch (error) {
    console.log("Database Error", error);
    process.exit(1);
  }
};

export default connectDB;
