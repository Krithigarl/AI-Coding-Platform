import { Request, Response } from "express";
import User from "../models/User";
import Course from "../models/Course";
import CourseRegistration from "../models/CourseRegistration";

// Get dashboard stats for Admin
export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRegistrations = await CourseRegistration.countDocuments();
    const totalCourses = await Course.countDocuments();

    // Registrations per course breakdown
    const courseStats = await CourseRegistration.aggregate([
      {
        $group: {
          _id: "$courseName",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Recent registrations
    const recentRegistrations = await CourseRegistration.find()
      .sort({ createdAt: -1 })
      .limit(6);

    // Recent users
    const recentUsers = await User.find({}, "-password")
      .sort({ createdAt: -1 })
      .limit(6);

    return res.json({
      success: true,
      stats: {
        totalUsers,
        totalRegistrations,
        totalCourses: totalCourses || 4,
        activeMentors: 3,
        systemHealth: "100% Operational",
      },
      courseStats,
      recentRegistrations,
      recentUsers,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return res.status(500).json({ message: "Server error fetching admin stats" });
  }
};

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}, "-password").sort({ createdAt: -1 });
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: "Server error fetching users" });
  }
};

// Update user role
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Valid role ('user' or 'admin') is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, select: "-password" }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      success: true,
      message: `User role updated to ${role}`,
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error updating user role" });
  }
};

// Delete registration
export const deleteRegistration = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await CourseRegistration.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Registration not found" });
    }
    return res.json({ success: true, message: "Registration deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error deleting registration" });
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error deleting user" });
  }
};
