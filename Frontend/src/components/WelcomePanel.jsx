
import React from "react";
import { Button } from "react-bootstrap";
import { motion } from "framer-motion";
import {
  FaRobot,
  FaLaptopCode,
  FaRoad,
  FaShieldAlt,
  FaUsers,
  FaStar,
  FaBolt,
  FaArrowRight,
} from "react-icons/fa";

const WelcomePanel = ({ isLogin, setIsLogin }) => {
  const highlights = [
    [FaRobot, "AI Mentor", "Instant code help & error fixes."],
    [FaLaptopCode, "Code Sandbox", "Practice multiple programming languages."],
    [FaRoad, "Learning Roadmaps", "Guided path from beginner to developer."],
    [FaShieldAlt, "Role-Based Access", "Secure student & admin access."],
  ];

  return (
    <div className="left-panel">

      <div className="brand-badge-pill mb-3">
        <span className="live-dot" />
        <span>AI Learning Platform</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="welcome-brand-heading">
          Code<span className="accent-orange">Genius</span>
        </h1>

        <p className="welcome-tagline">
          Learn coding, practice skills, and get help from AI.
        </p>
      </motion.div>

      <div className="welcome-highlights-list my-4">
        {highlights.map(([Icon, title, desc], i) => (
          <motion.div
            key={title}
            className="highlight-card-row"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="highlight-icon-box">
              <Icon />
            </div>

            <div className="highlight-text-content">
              <h6 className="highlight-title">{title}</h6>
              <p className="highlight-desc">{desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* <div className="welcome-stats-row mb-4">
        <div className="stat-item">
          <FaUsers />
          <span>10K+ Coders</span>
        </div>

        <div className="stat-item">
          <FaStar />
          <span>4.9/5 Rating</span>
        </div>

        <div className="stat-item">
          <FaBolt />
          <span>99.9% Uptime</span>
        </div>
      </div> */}

      <div className="welcome-bottom-action">
        <p className="toggle-prompt-text mb-2">
          {isLogin
            ? "New to CodeGenius?"
            : "Already have an account?"}
        </p>

        <Button
          onClick={() => setIsLogin(!isLogin)}
          className="welcome-toggle-btn"
        >
          {isLogin ? "Create Account" : "Sign In"}
          <FaArrowRight className="ms-2" />
        </Button>
      </div>

    </div>
  );
};

export default WelcomePanel;
