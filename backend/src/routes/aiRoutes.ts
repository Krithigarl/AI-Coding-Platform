import express from "express";
import {
  getAIHint,
  runAndAnalyzeCode,
  chatWithMentor
} from "../controllers/aiController";

const router = express.Router();

// Get AI hint for current code and error
router.post("/hint", getAIHint);

// Run code and return stdout / error
router.post("/analyze", runAndAnalyzeCode);

// Status health check
router.get("/status", (req, res) => {
  res.json({
    status: "AI routes operational",
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your_gemini_api_key_here")
  });
});

export default router;
