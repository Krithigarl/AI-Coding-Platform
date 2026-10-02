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

// Chat with AI mentor
router.post("/chat", chatWithMentor);

// Status health check
router.get("/status", (req, res) => {
  const key = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : "";
  const isConfigured = Boolean(key && key !== "your_gemini_api_key_here");
  res.json({
    status: "AI routes operational",
    geminiConfigured: isConfigured,
    keyType: isConfigured ? (key.startsWith("AQ.") ? "Google AQ Format" : "Standard Key Format") : "None"
  });
});

export default router;
