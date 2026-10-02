import express from "express";
import {
  getAdminStats,
  getAllUsers,
  updateUserRole,
  deleteRegistration,
  deleteUser,
} from "../controllers/adminController";
import { authmiddleware } from "../middleware/authmiddleware";
import { isAdmin } from "../middleware/adminMiddleware";

const router = express.Router();

router.get("/stats", authmiddleware, isAdmin, getAdminStats);
router.get("/users", authmiddleware, isAdmin, getAllUsers);
router.patch("/users/:id/role", authmiddleware, isAdmin, updateUserRole);
router.delete("/users/:id", authmiddleware, isAdmin, deleteUser);
router.delete("/registrations/:id", authmiddleware, isAdmin, deleteRegistration);

export default router;
