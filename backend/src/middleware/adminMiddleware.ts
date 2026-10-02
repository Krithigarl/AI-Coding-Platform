import { Response, NextFunction } from "express";
import { AuthRequest } from "./authmiddleware";

export const isAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized: No user credentials found" });
    return;
  }

  if (req.user.role !== "admin") {
    res.status(403).json({ message: "Access denied. Admin privileges required." });
    return;
  }

  next();
};

export default isAdmin;
