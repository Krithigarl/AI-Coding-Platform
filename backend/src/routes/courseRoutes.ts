import express from "express";
import {
  getCourses,
  getCourseBySlug,
  getCourseRoadmap,
  registerForCourse,
  getUserRegistrations
} from "../controllers/courseController";

const router = express.Router();

router.get("/", getCourses);

// Registration routes
router.post("/register", registerForCourse);
router.get("/registrations", getUserRegistrations);

// Roadmap route placed before dynamic /:slug
router.get("/roadmap/:slug", getCourseRoadmap);

router.get("/:slug", getCourseBySlug);

export default router;