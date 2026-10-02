import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import connectDB from "./config/db";
import courseRoutes from "./routes/courseRoutes";
import aiRoutes from "./routes/aiRoutes";
import adminRoutes from "./routes/adminRoutes";

const app = express();
connectDB();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/admin", adminRoutes);
app.listen(process.env.PORT || 3000,()=>{console.log("Server is running on port address " + (process.env.PORT || 3000))})