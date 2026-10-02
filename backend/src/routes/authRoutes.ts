import express from "express";
import { register, login, getMe } from "../controllers/authController";
import { authmiddleware } from "../middleware/authmiddleware";

const router = express.Router();

// Public routes — no auth required
router.post("/register", register);
router.post("/login", login);

// Authenticated user profile route
router.get("/me", authmiddleware, getMe);

export default router;