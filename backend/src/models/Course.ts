import mongoose from "mongoose";

const TopicSchema = new mongoose.Schema({
  title: String,
  description: String,
  task: String
});

const LevelSchema = new mongoose.Schema({
  level: String,
  topics: [TopicSchema]
});

const CourseSchema = new mongoose.Schema({
  language: String,
  slug: String,
  levels: [LevelSchema]
});

export default mongoose.model("Course", CourseSchema);