import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProgressBar, Button, Spinner, Alert } from "react-bootstrap";
import {
  FaCheck,
  FaPlay,
  FaLock,
  FaCode,
  FaLightbulb,
  FaArrowRight,
  FaUserGraduate
} from "react-icons/fa";
import axios from "axios";

const defaultCoursesList = [
  { language: "Python", slug: "python", icon: "🐍" },
  { language: "Java", slug: "java", icon: "☕" },
  { language: "C++", slug: "cpp", icon: "💻" },
  { language: "C", slug: "c", icon: "🔷" },
  { language: "JavaScript", slug: "javascript", icon: "⚡" }
];

const Roadmap = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [courses, setCourses] = useState(defaultCoursesList);
  const [selectedSlug, setSelectedSlug] = useState(
    (id || "python").toLowerCase()
  );
  const [roadmapData, setRoadmapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 1. Fetch all available courses from backend
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/courses")
      .then((res) => {
        if (res.data && res.data.length > 0) {
          const formatted = res.data.map((c) => ({
            language: c.language,
            slug: c.slug,
            icon:
              c.slug === "python"
                ? "🐍"
                : c.slug === "java"
                ? "☕"
                : c.slug === "cpp" || c.slug === "c++"
                ? "💻"
                : c.slug === "c"
                ? "🔷"
                : "⚡"
          }));
          setCourses(formatted);
        }
      })
      .catch(() => {
        // use default fallback
      });
  }, []);

  // 2. Fetch specific course roadmap details from MongoDB
  const fetchRoadmap = async (slug) => {
    setLoading(true);
    setError("");

    let userId = null;
    try {
      const storedUser = localStorage.getItem("userId");
      if (storedUser) userId = JSON.parse(storedUser);
    } catch {
      // ignore
    }

    try {
      const res = await axios.get(
        `http://localhost:3000/api/courses/roadmap/${slug}${
          userId ? `?userId=${userId}` : ""
        }`
      );
      setRoadmapData(res.data);
    } catch (err) {
      console.error("Roadmap fetch error:", err);
      // Fallback: try standard course endpoint
      try {
        const fallbackRes = await axios.get(
          `http://localhost:3000/api/courses/${slug}`
        );
        const course = fallbackRes.data;
        const allTopics = [];
        course.levels?.forEach((lvl, lIdx) => {
          lvl.topics?.forEach((t, tIdx) => {
            allTopics.push({
              id: `${lvl.level}-${tIdx}`,
              title: t.title,
              description: t.description || t.task,
              level: lvl.level,
              status: lIdx === 0 && tIdx === 0 ? "completed" : lIdx === 0 && tIdx === 1 ? "current" : "locked"
            });
          });
        });

        setRoadmapData({
          language: course.language,
          slug: course.slug,
          isEnrolled: false,
          progress: 42,
          aiMentorSuggestion: `Complete "Variables & Data Types" to unlock Operators.`,
          topics: allTopics
        });
      } catch {
        setError("Could not load roadmap for this course from database.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap(selectedSlug);
  }, [selectedSlug]);

  const handleCourseChange = (slug) => {
    setSelectedSlug(slug);
  };

  const handleRegisterCourse = () => {
    navigate(`/course-register/${selectedSlug}`);
  };

  const handleStartLearning = () => {
    navigate(`/dashboard/learning/${selectedSlug}`);
  };

  return (
    <div className="roadmap-page-container">
      {/* Course Switcher Pills */}
      <div className="course-switcher-bar mb-4">
        <span className="switcher-label">Select Course:</span>
        <div className="course-pills-list">
          {courses.map((c) => (
            <button
              key={c.slug}
              className={`course-pill-btn ${
                selectedSlug === c.slug ? "active" : ""
              }`}
              onClick={() => handleCourseChange(c.slug)}
            >
              <span className="pill-icon">{c.icon}</span>
              <span>{c.language}</span>
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="warning" />
          <p className="mt-3 text-muted">Loading {selectedSlug} roadmap from database...</p>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : roadmapData ? (
        <div className="roadmap-main-card">
          {/* Header */}
          <div className="roadmap-header mb-4">
            <div className="roadmap-header-left">
              <div className="roadmap-icon-box">
                <FaCode />
              </div>
              <div>
                <h3 className="roadmap-title-text mb-0">
                  {roadmapData.language} Learning Roadmap
                </h3>
                <small className="roadmap-subtitle-text">
                  Beginner → Intermediate → Advanced
                </small>
              </div>
            </div>

            <div className="roadmap-progress-badge">
              {roadmapData.progress}% Completed
            </div>
          </div>

          {/* Timeline Steps List */}
          <div className="roadmap-timeline">
            {roadmapData.topics?.map((topic, index) => {
              const isCompleted = topic.status === "completed";
              const isCurrent = topic.status === "current";
              const isLocked = topic.status === "locked";

              return (
                <div
                  key={topic.id || index}
                  className={`timeline-step-item ${topic.status}`}
                >
                  {/* Vertical Connector line */}
                  {index < roadmapData.topics.length - 1 && (
                    <div className="timeline-connector-line"></div>
                  )}

                  {/* Step Icon Circle */}
                  <div className={`step-icon-circle ${topic.status}`}>
                    {isCompleted && <FaCheck className="icon-check" />}
                    {isCurrent && <span className="icon-current-dot"></span>}
                    {isLocked && <FaLock className="icon-lock" />}
                  </div>

                  {/* Step Content */}
                  <div className="step-content-box">
                    <div className={`step-status-tag ${topic.status}`}>
                      {isCompleted && "Completed"}
                      {isCurrent && "Current Topic"}
                      {isLocked && "Locked"}
                    </div>

                    <h5 className="step-title-text">{topic.title}</h5>

                    <p className="step-description-text mb-0">
                      {topic.description ||
                        topic.task ||
                        "Core concept and practice exercises."}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Section: Overall Progress */}
          <div className="roadmap-footer-section mt-4 pt-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="overall-label">Overall Progress</span>
              <span className="overall-percent">{roadmapData.progress}%</span>
            </div>

            <ProgressBar
              now={roadmapData.progress}
              className="roadmap-progress-bar mb-4"
            />

            {/* AI Mentor Suggestion Box */}
            <div className="ai-suggestion-card mb-4">
              <div className="ai-suggestion-header">
                <FaLightbulb className="ai-suggestion-icon" />
                <span>AI Mentor Suggestion</span>
              </div>
              <p className="ai-suggestion-body mb-0">
                {roadmapData.aiMentorSuggestion ||
                  `Complete "${
                    roadmapData.topics?.find((t) => t.status === "current")
                      ?.title || "current topic"
                  }" to unlock the next level.`}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="roadmap-actions-row">
              <Button
                className="btn-start-learning w-100"
                onClick={handleStartLearning}
              >
                {roadmapData.isEnrolled
                  ? "Start Learning"
                  : `Enroll & Start Learning (${roadmapData.language})`}
              </Button>

              <div className="text-center mt-3">
                <Button
                  variant="link"
                  className="register-course-link"
                  onClick={handleRegisterCourse}
                >
                  <FaUserGraduate className="me-2" />
                  Want to register this course? Go to Registration Form{" "}
                  <FaArrowRight className="ms-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Roadmap;
