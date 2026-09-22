import mongoose from "mongoose";

export interface ICourseRegistration extends mongoose.Document {
  fullname: string;
  email: string;
  phone: string;
  education: string;
  experience: string;
  learningGoal?: string;
  courseSlug: string;
  courseName: string;
  userId?: string;
  createdAt: Date;
}

const CourseRegistrationSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  education: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  learningGoal: {
    type: String,
    default: "",
  },
  courseSlug: {
    type: String,
    required: true,
    trim: true,
  },
  courseName: {
    type: String,
    required: true,
    trim: true,
  },
  userId: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<ICourseRegistration>(
  "CourseRegistration",
  CourseRegistrationSchema
);
