import React, { useState, useEffect } from "react";
import { Row, Col, Card, ProgressBar, Badge, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  FaChartLine,
  FaCheckCircle,
  FaBookOpen,
  FaTrophy,
  FaRocket,
  FaArrowRight,
  FaClock,
  FaMedal
} from "react-icons/fa";
import axios from "axios";

import pythonImg from "../assets/python.png";
import javaImg from "../assets/java.png";
import cppImg from "../assets/c++.png";
import cImg from "../assets/c.png";

const courseImageMap = {
  python: pythonImg,
  java: javaImg,
  cpp: cppImg,
  "c++": cppImg,
  c: cImg,
  javascript: javaImg,
};

const Progress = () => {
  const navigate = useNavigate();

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Learner");

  useEffect(() => {
    const fetchUserProgress = async () => {
      setLoading(true);
      try {
        const stored = localStorage.getItem("user");
        let uId = null;
        let uEmail = null;
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setUserName(parsed.fullname || parsed.name || "Learner");
            uId = parsed.id || parsed._id;
            uEmail = parsed.email;
          } catch {}
        }

        const params = {};
        if (uId) params.userId = uId;
        else if (uEmail) params.email = uEmail;

        const res = await axios.get(
          "http://localhost:3000/api/courses/registrations",
          { params }
        );

        if (Array.isArray(res.data)) {
          setRegistrations(res.data);
        }
      } catch (err) {
        console.warn("Could not load user registrations", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProgress();
  }, []);

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5" style={{ minHeight: "50vh" }}>
        <Spinner animation="border" style={{ color: "#FF8300", width: 50, height: 50 }} />
        <p className="mt-3 text-muted">Calculating your real-time learning metrics...</p>
      </div>
    );
  }

  const totalEnrolled = registrations.length;
  const completedCourses = registrations.filter(
    (r) => (r.progress || 0) >= 100 || r.status === "completed"
  );
  const inProgressCourses = registrations.filter(
    (r) => (r.progress || 0) < 100 && r.status !== "completed"
  );

  const totalTopicsCompleted = registrations.reduce(
    (acc, cur) => acc + (cur.completedTopics?.length || (cur.progress > 0 ? 1 : 0)),
    0
  );

  return (
    <div className="dashboard-view-wrapper">
      {/* Page Header Banner */}
      <div
        className="dash-content-card mb-4"
        style={{
          background: "linear-gradient(135deg, rgba(255,131,0,0.12), rgba(0,210,255,0.06))",
          border: "1px solid rgba(255,131,0,0.25)",
        }}
      >
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span style={{ fontSize: 24 }}>📈</span>
              <h2 className="text-white mb-0" style={{ fontWeight: 800 }}>
                Learning Progress &amp; Mastery
              </h2>
            </div>
            <p className="text-muted small mb-0">
              Track topic completions, practice milestones, and certification readiness in real-time.
            </p>
          </div>

          <Button
            className="continue-btn-orange"
            onClick={() => navigate("/dashboard/courses")}
          >
            <FaBookOpen className="me-2" /> Explore More Courses
          </Button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <Row className="g-3 mb-4">
        <Col lg={3} sm={6}>
          <div className="dash-stat-card">
            <span className="dash-stat-label">Enrolled Courses</span>
            <h3 className="dash-stat-value">{totalEnrolled}</h3>
          </div>
        </Col>

        <Col lg={3} sm={6}>
          <div className="dash-stat-card">
            <span className="dash-stat-label">Courses Completed</span>
            <h3 className="dash-stat-value" style={{ color: "#28a745" }}>
              {completedCourses.length}
            </h3>
          </div>
        </Col>

        <Col lg={3} sm={6}>
          <div className="dash-stat-card">
            <span className="dash-stat-label">Courses In Progress</span>
            <h3 className="dash-stat-value" style={{ color: "#FF8300" }}>
              {inProgressCourses.length}
            </h3>
          </div>
        </Col>

        <Col lg={3} sm={6}>
          <div className="dash-stat-card">
            <span className="dash-stat-label">Topics Mastered</span>
            <h3 className="dash-stat-value" style={{ color: "#00d2ff" }}>
              {totalTopicsCompleted}
            </h3>
          </div>
        </Col>
      </Row>

      {/* Enrolled Courses Progress Breakdown */}
      <div className="dash-content-card mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="dash-card-title mb-0">
            <FaChartLine className="me-2 text-warning" /> Course Progress Breakdown
          </h4>
          <span className="small text-muted">
            Synchronized with MongoDB database
          </span>
        </div>

        {registrations.length === 0 ? (
          <div className="text-center py-5">
            <FaBookOpen size={48} style={{ color: "rgba(255,255,255,0.2)", marginBottom: 12 }} />
            <h5 className="text-white">No courses started yet</h5>
            <p className="text-muted small">
              Enroll in a course from our catalog to begin tracking your syllabus progress!
            </p>
            <Button
              className="continue-btn-orange mt-2"
              onClick={() => navigate("/dashboard/courses")}
            >
              <FaRocket className="me-2" /> Start Learning Now
            </Button>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {registrations.map((reg, idx) => {
              const slug = (reg.courseSlug || "python").toLowerCase();
              const img = courseImageMap[slug] || pythonImg;
              const percent = Math.min(100, Math.max(0, reg.progress || 0));
              const isCompleted = percent >= 100 || reg.status === "completed";
              const completedCount = reg.completedTopics?.length || (percent > 0 ? 1 : 0);

              return (
                <div
                  key={idx}
                  className="p-3 rounded"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
                    <div className="d-flex align-items-center gap-3">
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 10,
                          background: "rgba(0,0,0,0.4)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <img src={img} alt={reg.courseName} width={30} height={30} />
                      </div>
                      <div>
                        <div className="d-flex align-items-center gap-2">
                          <h6 className="text-white mb-0" style={{ fontWeight: 700 }}>
                            {reg.courseName}
                          </h6>
                          {isCompleted ? (
                            <Badge bg="success" pill>
                              <FaTrophy className="me-1" /> Completed
                            </Badge>
                          ) : (
                            <Badge bg="warning" text="dark" pill>
                              In Progress
                            </Badge>
                          )}
                        </div>
                        <span className="small text-muted">
                          {reg.experience || "Beginner"} · {completedCount} Topics Finished
                        </span>
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        className="rounded-pill px-3 py-1"
                        style={{ fontSize: 12 }}
                        onClick={() => navigate(`/dashboard/roadmap/${slug}`)}
                      >
                        View Roadmap
                      </Button>
                      <Button
                        size="sm"
                        className="continue-btn-orange rounded-pill px-3 py-1"
                        style={{ fontSize: 12 }}
                        onClick={() => navigate(`/dashboard/learning/${slug}`)}
                      >
                        {isCompleted ? "Review Syllabus" : "Continue Learning"} &rarr;
                      </Button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="d-flex align-items-center gap-3 mt-2">
                    <ProgressBar
                      now={percent}
                      variant={isCompleted ? "success" : undefined}
                      className="custom-dash-progressbar flex-grow-1"
                      style={{ height: 10 }}
                    />
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: 13,
                        color: isCompleted ? "#28a745" : "#FF8300",
                        minWidth: 44,
                        textAlign: "right",
                      }}
                    >
                      {percent}%
                    </span>
                  </div>

                  {/* Completed Topic Chips if any */}
                  {reg.completedTopics && reg.completedTopics.length > 0 && (
                    <div className="d-flex align-items-center gap-1 flex-wrap mt-2 pt-2 border-top border-secondary border-opacity-10">
                      <span className="small text-muted me-2" style={{ fontSize: 11 }}>
                        Finished Topics:
                      </span>
                      {reg.completedTopics.map((topId, tIdx) => (
                        <Badge
                          key={tIdx}
                          bg="dark"
                          text="success"
                          className="border border-success border-opacity-25"
                          style={{ fontSize: 10, fontWeight: 500 }}
                        >
                          <FaCheckCircle className="me-1" /> {topId}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Achievements / Certification Info */}
      <div
        className="dash-content-card p-4 text-center"
        style={{
          background: "linear-gradient(135deg, rgba(40,167,69,0.08), rgba(255,131,0,0.08))",
          border: "1px dashed rgba(255,131,0,0.3)",
        }}
      >
        <FaMedal size={36} className="text-warning mb-2" />
        <h5 className="text-white">Certification Milestone</h5>
        <p className="text-muted small mx-auto mb-3" style={{ maxWidth: 520 }}>
          Reach 100% completion in any course by finishing all syllabus topics and practice exercises to unlock your official CodeGenius Certificate of Completion!
        </p>
        <Button
          size="sm"
          className="continue-btn-orange"
          onClick={() => navigate("/dashboard/courses")}
        >
          Browse Open Courses
        </Button>
      </div>
    </div>
  );
};

export default Progress;