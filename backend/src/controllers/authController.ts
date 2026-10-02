import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
// import { authmiddleware } from "../middleware/authmiddleware";
// Register
export const register = async (req: Request, res: Response) => {
  try {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Security Rule: Newly registered accounts always default to "user".
    // Admin roles cannot be assigned or selected via public registration.
    const role = "user";

    const user = await User.create({
      fullname,
      email,
      password: hashedPassword,
      role,
    });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: (user as any).role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    return res.status(201).json({
      message: "Registration Successful",
      token,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: (user as any).role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
    });
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({
        message: "Wrong Password",
      });
    }

    // Role is strictly retrieved from the authenticated user's record in MongoDB
    const role = (user as any).role || "user";

    const token = jwt.sign(
      { id: user._id, email: user.email, role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    return res.json({
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
    });
  }
};

// Get currently authenticated user profile
export const getMe = async (req: Request, res: Response) => {
  try {
    const authReq = req as any;
    if (!authReq.user || !authReq.user.id) {
      return res.status(401).json({ message: "Unauthorized: No token credentials found" });
    }

    const user = await User.findById(authReq.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        createdAt: (user as any).createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error fetching user profile" });
  }
};