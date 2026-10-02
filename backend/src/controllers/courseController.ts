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
    let userRegistration: any = null;
    if (userId || email) {
      const regQuery: any = { courseSlug: slug };
      if (userId) regQuery.userId = userId;
      else if (email) regQuery.email = email;

      userRegistration = await CourseRegistration.findOne(regQuery);
      if (userRegistration) isEnrolled = true;
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

    // Assign status progression based on real database records
    const userCompleted = new Set(userRegistration?.completedTopics || []);
    let currentAssigned = false;

    topicsList.forEach((t) => {
      if (userCompleted.has(t.id) || userCompleted.has(t.title)) {
        t.status = "completed";
      } else if (!currentAssigned) {
        t.status = "current";
        currentAssigned = true;
      } else {
        t.status = "locked";
      }
    });

    if (!currentAssigned && topicsList.length > 0 && topicsList[0].status !== "completed") {
      topicsList[0].status = "current";
    }

    const completedCount = topicsList.filter((t) => t.status === "completed").length;
    const progressPercent = topicsList.length > 0
      ? Math.round((completedCount / topicsList.length) * 100)
      : 0;

    const currentTopic = topicsList.find((t) => t.status === "current") || topicsList[0];
    const nextTopic = topicsList.find((t) => t.status === "locked") || topicsList[topicsList.length - 1];

    const aiMentorSuggestion = currentTopic && nextTopic
      ? `Complete "${currentTopic.title}" to unlock "${nextTopic.title}".`
      : `Keep practicing ${course.language} code to master all levels!`;

    return res.json({
      language: course.language,
      slug: course.slug,
      isEnrolled,
      progress: userRegistration?.progress !== undefined ? userRegistration.progress : progressPercent,
      completedCount,
      totalTopics: topicsList.length,
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
      userId: userId || null,
      completedTopics: [],
      progress: 0,
      status: "in-progress"
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

// Update or record topic completion for a course
export const updateTopicProgress = async (req: Request, res: Response) => {
  try {
    const { courseSlug, topicId, userId, email, totalTopics = 10, nextTopicId, courseName } = req.body;

    if (!courseSlug || !topicId) {
      return res.status(400).json({ message: "courseSlug and topicId are required" });
    }

    const query: any = { courseSlug: courseSlug.toLowerCase() };
    if (userId) query.userId = userId;
    else if (email) query.email = email.toLowerCase();
    else {
      return res.status(400).json({ message: "userId or email is required to update progress" });
    }

    let registration = await CourseRegistration.findOne(query);

    // If student isn't explicitly registered yet, auto-enroll them seamlessly
    if (!registration) {
      registration = await CourseRegistration.create({
        fullname: req.body.fullname || "Student",
        email: email || "student@example.com",
        phone: "N/A",
        education: "Self-Paced Learner",
        experience: "Beginner",
        courseSlug: courseSlug.toLowerCase(),
        courseName: courseName || `${courseSlug.toUpperCase()} Programming`,
        userId: userId || null,
        completedTopics: [topicId],
        currentTopic: nextTopicId || topicId,
        progress: Math.min(100, Math.round((1 / Math.max(1, totalTopics)) * 100)),
        status: "in-progress"
      });
    } else {
      // Add topicId uniquely
      const completed = new Set(registration.completedTopics || []);
      completed.add(topicId);
      const completedList = Array.from(completed);

      const calculatedPercent = Math.min(
        100,
        Math.round((completedList.length / Math.max(1, totalTopics)) * 100)
      );

      registration.completedTopics = completedList;
      registration.progress = calculatedPercent;
      registration.currentTopic = nextTopicId || topicId;
      if (calculatedPercent >= 100) {
        registration.status = "completed";
      }

      await registration.save();
    }

    return res.json({
      success: true,
      message: `Topic ${topicId} marked as completed!`,
      progress: registration.progress,
      completedTopics: registration.completedTopics,
      currentTopic: registration.currentTopic,
      status: registration.status
    });
  } catch (error) {
    console.error("Progress update error:", error);
    return res.status(500).json({ message: "Server error saving progress to MongoDB" });
  }
};

// Get learning progress for a course
export const getCourseProgress = async (req: Request, res: Response) => {
  try {
    const { courseSlug } = req.params;
    const { userId, email } = req.query;

    const query: any = { courseSlug: (courseSlug as string).toLowerCase() };
    if (userId) query.userId = userId;
    else if (email) query.email = (email as string).toLowerCase();

    const registration = await CourseRegistration.findOne(query);

    if (!registration) {
      return res.json({
        isEnrolled: false,
        progress: 0,
        completedTopics: [],
        currentTopic: "",
        status: "not-started"
      });
    }

    return res.json({
      isEnrolled: true,
      progress: registration.progress || 0,
      completedTopics: registration.completedTopics || [],
      currentTopic: registration.currentTopic || "",
      status: registration.status || "in-progress",
      registration
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error fetching course progress" });
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