import { Request, Response } from "express";
import Course from "../models/Course";
import CourseRegistration from "../models/CourseRegistration";

// Get all courses
export const getCourses = async (req: Request, res: Response) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({
      message: "Server Error"
    });
  }
};

// Get single course by slug
export const getCourseBySlug = async (req: Request, res: Response) => {
  try {
    const course = await Course.findOne({
      slug: (req.params.slug as string).toLowerCase()
    } as any);

    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({
      message: "Server Error"
    });
  }
};

// Get enriched roadmap for a specific course
export const getCourseRoadmap = async (req: Request, res: Response) => {
  try {
    const slug = (req.params.slug as string).toLowerCase();
    const { userId, email } = req.query;

    const course = await Course.findOne({ slug } as any);

    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });
    }

    // Check if user is registered for this course
    let isEnrolled = false;
    if (userId || email) {
      const regQuery: any = { courseSlug: slug };
      if (userId) regQuery.userId = userId;
      else if (email) regQuery.email = email;

      const reg = await CourseRegistration.findOne(regQuery);
      if (reg) isEnrolled = true;
    }

    // Flatten all topics from Beginner, Intermediate, Advanced levels into an ordered roadmap
    const topicsList: Array<{
      id: string;
      title: string;
      description: string;
      task: string;
      level: string;
      status: "completed" | "current" | "locked";
    }> = [];

    course.levels?.forEach((lvl, lvlIdx) => {
      lvl.topics?.forEach((top, topIdx) => {
        topicsList.push({
          id: `${lvl.level}-${topIdx}`,
          title: top.title || `Topic ${topIdx + 1}`,
          description: top.description || "",
          task: top.task || "",
          level: lvl.level || "General",
          status: "locked"
        });
      });
    });

    // Assign status progression
    if (topicsList.length > 0) {
      topicsList[0].status = "completed";
      if (topicsList.length > 1) {
        topicsList[1].status = "current";
      }
    }

    const completedCount = topicsList.filter((t) => t.status === "completed").length;
    const progressPercent = topicsList.length > 0 ? Math.round((completedCount / topicsList.length) * 100) : 0;
    const displayProgress = isEnrolled ? Math.max(progressPercent, 42) : 20;

    const currentTopic = topicsList.find((t) => t.status === "current") || topicsList[0];
    const nextTopic = topicsList.find((t) => t.status === "locked") || topicsList[topicsList.length - 1];

    const aiMentorSuggestion = currentTopic && nextTopic
      ? `Complete "${currentTopic.title}" to unlock ${nextTopic.title}.`
      : `Keep practicing ${course.language} code to master all levels!`;

    return res.json({
      language: course.language,
      slug: course.slug,
      isEnrolled,
      progress: displayProgress,
      aiMentorSuggestion,
      topics: topicsList
    });
  } catch (error) {
    console.error("Roadmap error:", error);
    return res.status(500).json({
      message: "Server Error fetching course roadmap"
    });
  }
};

// Register for course & save data to MongoDB
export const registerForCourse = async (req: Request, res: Response) => {
  try {
    const {
      fullname,
      email,
      phone,
      education,
      experience,
      learningGoal,
      courseSlug,
      courseName,
      userId
    } = req.body;

    if (!fullname || !email || !phone || !education || !experience) {
      return res.status(400).json({
        message: "Please fill all required fields: Full Name, Email, Phone, Education, Experience."
      });
    }

    const registration = await CourseRegistration.create({
      fullname,
      email,
      phone,
      education,
      experience,
      learningGoal: learningGoal || "",
      courseSlug: courseSlug || "python",
      courseName: courseName || "Python Programming",
      userId: userId || null
    });

    return res.status(201).json({
      success: true,
      message: `Enrolled successfully in ${courseName || "the course"}!`,
      registration
    });
  } catch (error) {
    console.error("Course registration error:", error);
    return res.status(500).json({
      message: "Server Error saving course registration to MongoDB."
    });
  }
};

// Get registrations for a user
export const getUserRegistrations = async (req: Request, res: Response) => {
  try {
    const { userId, email } = req.query;
    const query: any = {};
    if (userId) query.userId = userId;
    else if (email) query.email = email;

    const registrations = await CourseRegistration.find(query).sort({ createdAt: -1 });
    return res.json(registrations);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};