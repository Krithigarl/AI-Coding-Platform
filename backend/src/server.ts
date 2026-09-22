import express from "express"
import cors from "cors"
import authRoutes from './routes/authRoutes'
import connectDB from "./config/db"
import env from "dotenv"
import courseRoutes from "./routes/courseRoutes";
import aiRoutes from "./routes/aiRoutes";
const app = express()

env.config()
connectDB();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/ai", aiRoutes);
app.listen(process.env.PORT || 3000,()=>{console.log("Server is running on port address " + (process.env.PORT || 3000))})