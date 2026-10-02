import express from "express";
import {
  getCourses,
  getCourseBySlug,
  getCourseRoadmap,
  registerForCourse,
  getUserRegistrations,
  updateTopicProgress,
  getCourseProgress
} from "../controllers/courseController";

const router = express.Router();

router.get("/", getCourses);

// Registration & Progress routes
router.post("/register", registerForCourse);
router.get("/registrations", getUserRegistrations);
router.post("/progress/complete-topic", updateTopicProgress);
router.get("/progress/:courseSlug", getCourseProgress);

// Roadmap route placed before dynamic /:slug
router.get("/roadmap/:slug", getCourseRoadmap);

router.get("/:slug", getCourseBySlug);

export default router;