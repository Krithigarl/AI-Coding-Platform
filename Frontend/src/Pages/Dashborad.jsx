import React, { useState, useEffect } from "react";
import { Row, Col, ProgressBar, Button, Spinner, Alert } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { FaCheckCircle, FaRocket, FaBookOpen, FaTrophy, FaPlus, FaShieldAlt } from "react-icons/fa";
import axios from "axios";

import python from "../assets/python.png";
import java from "../assets/java.png";
import cpp from "../assets/c++.png";
import c from "../assets/c.png";

const courseImageMap = {
  python: python,
  java: java,
  "c++": cpp,
  cpp: cpp,
  c: c,
};

const getImageForSlug = (slug = "") => {
  const key = slug.toLowerCase();
  return courseImageMap[key] || python;
};

/* ─── Empty state for brand-new users ─────────────────────────────────────── */
const EmptyDashboard = ({ userName, navigate }) => (
  <div className="dashboard-view-wrapper">
    <h2 className="dash-welcome-heading">Welcome, {userName}! 👋</h2>
    <p className="dash-subtitle">You haven't enrolled in any courses yet. Start your journey today!</p>

    <div className="empty-dashboard-hero">
      <div className="empty-hero-icon">
        <FaRocket size={64} />
      </div>
      <h3 className="empty-hero-title">Start Learning Now</h3>
      <p className="empty-hero-desc">
        Explore our free AI-powered courses in Python, Java, C++, and more.
        Pick a course, enroll in seconds, and track your progress right here.
      </p>
      <Button
        className="continue-btn-orange mt-3"
        onClick={() => navigate("/courses")}
      >
        <FaPlus className="me-2" />
        Browse &amp; Enroll in Courses
      </Button>
    </div>

    {/* Suggested courses */}
    <div className="dash-content-card mt-4">
      <h4 className="dash-card-title">Suggested Courses</h4>
      <Row className="g-3 mt-1">
        {[
          { name: "Python", slug: "python", img: python, desc: "Great for beginners" },
          { name: "Java", slug: "java", img: java, desc: "Object-oriented power" },
          { name: "C++", slug: "cpp", img: cpp, desc: "Performance & systems" },
          { name: "C", slug: "c", img: c, desc: "Fundamentals of programming" },
        ].map((course) => (
          <Col xl={3} md={6} key={course.slug}>
            <div className="dash-course-grid-card">
              <div className="course-icon-holder mb-2">
                <img src={course.img} alt={course.name} width={48} height={48} />
              </div>
              <h6 className="course-card-name">{course.name}</h6>
              <div className="small text-muted mb-3">{course.desc}</div>
              <Button
                size="sm"
                className="w-100 continue-btn-orange"
                onClick={() => navigate(`/enroll/${course.slug}`)}
              >
                Enroll Free
              </Button>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  </div>
);

/* ─── Main Dashboard ───────────────────────────────────────────────────────── */
const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [userName, setUserName] = useState("Student");
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ── Read user info from localStorage and backend ──────────────────────── */
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object") {
          setUserName(parsed.fullname || parsed.name || "Student");
          setUserId(parsed.id || null);
          setUserEmail(parsed.email || null);
        } else if (typeof parsed === "string") {
          setUserName(parsed);
        }
      }

      const uid = localStorage.getItem("userId");
      if (uid) {
        try {
          setUserId(JSON.parse(uid));
        } catch {
          setUserId(uid);
        }
      }
    } catch {
      // fallback
    }

    const fetchMe = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/auth/me");
        if (res.data?.user) {
          const u = res.data.user;
          setUserName(u.fullname || "Student");
          setUserId(u.id || u._id);
          setUserEmail(u.email);
        }
      } catch (err) {}
    };

    if (localStorage.getItem("token")) {
      fetchMe();
    }
  }, []);

  /* ── Fetch real registrations from backend ─────────────────────────────── */
  useEffect(() => {
    const fetchRegistrations = async () => {
      setLoading(true);
      try {
        const params = {};
        if (userId) params.userId = userId;
        else if (userEmail) params.email = userEmail;

        const res = await axios.get(
          "http://localhost:3000/api/courses/registrations",
          { params }
        );
        setRegistrations(Array.isArray(res.data) ? res.data : []);
      } catch {
        setRegistrations([]);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch once we have the user identity resolved
    // Run when userId or userEmail becomes available (or immediately if neither changes)
    fetchRegistrations();
  }, [userId, userEmail]);

  /* ── Loading state ─────────────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="dashboard-view-wrapper d-flex align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <Spinner animation="border" style={{ color: "#FF8300", width: 56, height: 56 }} />
          <p className="mt-3 text-muted">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  /* ── New user — no enrollments ─────────────────────────────────────────── */
  if (registrations.length === 0) {
    return <EmptyDashboard userName={userName} navigate={navigate} />;
  }

  /* ── Derive stats from real data ───────────────────────────────────────── */
  const completedCourses = registrations.filter(
    (r) => r.progress >= 100 || r.status === "completed"
  );
  const inProgressCourses = registrations.filter(
    (r) => !r.progress || (r.progress < 100 && r.status !== "completed")
  );

  // Pick the most recently enrolled course as "Continue Learning"
  const continueCourse = inProgressCourses[0] || registrations[0];

  const enrolledCount = registrations.length;
  const completedCount = completedCourses.length;

  /* ── Render enrolled dashboard ─────────────────────────────────────────── */
  return (
    <div className="dashboard-view-wrapper">
      {location.state?.accessDenied && (
        <Alert variant="danger" dismissible className="mb-4">
          <FaShieldAlt className="me-2" />
          <strong>Access Denied:</strong> You do not have administrative privileges to access the Admin Console.
        </Alert>
      )}

      {/* Welcome */}
      <h2 className="dash-welcome-heading">Welcome back, {userName}! 👋</h2>
      <p className="dash-subtitle">Continue your learning journey.</p>

      {/* Stat Cards */}
      <Row className="g-3 mb-4">
        <Col lg={3} sm={6}>
          <div className="dash-stat-card">
            <span className="dash-stat-label">Courses Enrolled</span>
            <h3 className="dash-stat-value">{enrolledCount}</h3>
          </div>
        </Col>
        <Col lg={3} sm={6}>
          <div className="dash-stat-card">
            <span className="dash-stat-label">Courses Completed</span>
            <h3 className="dash-stat-value">{completedCount}</h3>
          </div>
        </Col>
        <Col lg={3} sm={6}>
          <div className="dash-stat-card">
            <span className="dash-stat-label">In Progress</span>
            <h3 className="dash-stat-value">{inProgressCourses.length}</h3>
          </div>
        </Col>
        <Col lg={3} sm={6}>
          <div className="dash-stat-card">
            <Button
              className="w-100 continue-btn-orange"
              style={{ marginTop: 4 }}
              onClick={() => navigate("/courses")}
            >
              <FaPlus className="me-2" />
              Enroll More
            </Button>
          </div>
        </Col>
      </Row>

      {/* Middle Section */}
      <Row className="g-4 mb-4">
        {/* Continue Learning */}
        {continueCourse && (
          <Col lg={6}>
            <div className="dash-content-card">
              <h4 className="dash-card-title">Continue Learning</h4>
              <div className="continue-learning-box">
                <div className="course-hero-row">
                  <div className="course-logo-wrap">
                    <img
                      src={getImageForSlug(continueCourse.courseSlug)}
                      alt={continueCourse.courseName}
                    />
                  </div>
                  <div className="course-text-details">
                    <span className="course-category-tag">{continueCourse.courseName}</span>
                    <h5 className="course-topic-name">
                      {continueCourse.experience === "Beginner"
                        ? "Introduction & Basics"
                        : continueCourse.experience === "Intermediate"
                        ? "Core Concepts"
                        : "Advanced Topics"}
                    </h5>
                  </div>
                </div>

                <div className="course-progress-container">
                  <div className="progress-percent-label">
                    {continueCourse.progress || 10}%
                  </div>
                  <ProgressBar
                    now={continueCourse.progress || 10}
                    className="custom-dash-progressbar"
                  />
                </div>

                <div className="d-flex justify-content-end">
                  <Button
                    className="continue-btn-orange"
                    onClick={() => {
                      const slug = continueCourse.courseSlug || "python";
                      if (continueCourse.currentTopic) {
                        navigate(
                          `/dashboard/learning/${slug}?topic=${encodeURIComponent(
                            continueCourse.currentTopic
                          )}`
                        );
                      } else {
                        navigate(`/dashboard/learning/${slug}`);
                      }
                    }}
                  >
                    Continue Learning &rarr;
                  </Button>
                </div>
              </div>
            </div>
          </Col>
        )}

        {/* Enrollment Summary */}
        <Col lg={continueCourse ? 6 : 12}>
          <div className="dash-content-card h-100">
            <h4 className="dash-card-title">Enrollment Summary</h4>
            <div className="activity-list">
              {registrations.slice(0, 4).map((reg, i) => {
                const isCompleted =
                  reg.progress >= 100 || reg.status === "completed";
                return (
                  <div className="activity-item" key={i}>
                    <div className="activity-item-left">
                      <FaCheckCircle
                        className={`activity-status-dot ${
                          isCompleted ? "green" : "orange"
                        }`}
                      />
                      <div>
                        <div className="activity-text-title">
                          {reg.courseName}
                          {isCompleted && (
                            <FaTrophy
                              style={{ color: "#FFD700", marginLeft: 6 }}
                              title="Completed!"
                            />
                          )}
                        </div>
                        <div className="activity-time-stamp">
                          {isCompleted
                            ? "✅ Completed"
                            : `Enrolled · ${reg.experience || "Beginner"}`}
                        </div>
                      </div>
                    </div>
                    <span
                      className="activity-chevron"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        navigate(
                          `/dashboard/roadmap/${reg.courseSlug || "python"}`
                        )
                      }
                    >
                      &gt;&gt;
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </Col>
      </Row>

      {/* My Courses — real data */}
      <div className="dash-content-card">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h4 className="dash-card-title mb-0">My Courses</h4>
          <Button
            size="sm"
            className="continue-btn-orange"
            onClick={() => navigate("/courses")}
          >
            <FaPlus className="me-1" /> Enroll More
          </Button>
        </div>

        <Row className="g-3 mt-1">
          {registrations.map((reg, index) => {
            const isCompleted =
              reg.progress >= 100 || reg.status === "completed";
            const progress = reg.progress || 10;
            const slug = reg.courseSlug || "python";

            return (
              <Col xl={3} md={6} key={index}>
                <div className="dash-course-grid-card" style={{ position: "relative" }}>
                  {isCompleted && (
                    <div
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        background: "linear-gradient(135deg,#FFD700,#FF8300)",
                        borderRadius: 20,
                        padding: "2px 10px",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#000",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <FaTrophy size={10} /> Done
                    </div>
                  )}

                  <div className="course-icon-holder mb-2">
                    <img
                      src={getImageForSlug(slug)}
                      alt={reg.courseName}
                      width={48}
                      height={48}
                    />
                  </div>
                  <h6 className="course-card-name">{reg.courseName}</h6>
                  <div className="small text-muted mb-2">
                    {isCompleted ? "Completed ✅" : `${reg.experience || "Beginner"} · In Progress`}
                  </div>
                  <ProgressBar
                    now={isCompleted ? 100 : progress}
                    className="custom-dash-progressbar mb-3"
                    variant={isCompleted ? "success" : undefined}
                  />
                  <div className="d-flex gap-2">
                    <Button
                      size="sm"
                      className="flex-grow-1 continue-btn-orange"
                      style={{ fontSize: "0.8rem", padding: "6px 8px" }}
                      onClick={() => {
                        if (reg.currentTopic) {
                          navigate(
                            `/dashboard/learning/${slug}?topic=${encodeURIComponent(
                              reg.currentTopic
                            )}`
                          );
                        } else {
                          navigate(`/dashboard/learning/${slug}`);
                        }
                      }}
                    >
                      {isCompleted ? "Review Lesson" : "Continue"}
                    </Button>
                    <Button
                      size="sm"
                      className="btn-outline-dash"
                      style={{ fontSize: "0.8rem", padding: "6px 10px" }}
                      onClick={() => navigate(`/dashboard/roadmap/${slug}`)}
                      title="View Course Syllabus & Roadmap"
                    >
                      Roadmap
                    </Button>
                  </div>
                </div>
              </Col>
            );
          })}

          {/* Always show an "Enroll More" card at the end */}
          <Col xl={3} md={6}>
            <div
              className="dash-course-grid-card d-flex flex-column align-items-center justify-content-center"
              style={{
                border: "2px dashed rgba(255,131,0,0.35)",
                cursor: "pointer",
                minHeight: 180,
              }}
              onClick={() => navigate("/courses")}
            >
              <FaPlus size={28} style={{ color: "#FF8300", marginBottom: 10 }} />
              <h6 className="course-card-name" style={{ color: "#FF8300" }}>
                Enroll in a New Course
              </h6>
              <div className="small text-muted text-center">
                Explore more free courses
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Dashboard;