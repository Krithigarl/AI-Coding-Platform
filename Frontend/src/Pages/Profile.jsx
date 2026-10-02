import React, { useState, useEffect } from "react";
import { Row, Col, Card, Badge, ProgressBar, Button, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaShieldAlt,
  FaCalendarAlt,
  FaBook,
  FaTrophy,
  FaCheckCircle,
  FaGraduationCap,
  FaRocket,
  FaArrowRight
} from "react-icons/fa";
import axios from "axios";
import userAvatar from "../assets/user4.jpg";

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    fullname: "Student",
    email: "student@example.com",
    role: "user",
    createdAt: null,
    id: null,
  });

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfileAndCourses = async () => {
      setLoading(true);
      setError("");

      try {
        // 1. Read initial cache from localStorage
        const stored = localStorage.getItem("user");
        let localUser = null;
        if (stored) {
          try {
            localUser = JSON.parse(stored);
            if (localUser && typeof localUser === "object") {
              setUser((prev) => ({
                ...prev,
                fullname: localUser.fullname || localUser.name || prev.fullname,
                email: localUser.email || prev.email,
                role: localUser.role || prev.role,
                id: localUser.id || localUser._id || prev.id,
              }));
            }
          } catch {}
        }

        // 2. Fetch fresh profile from /api/auth/me
        let resolvedUserId = localUser?.id || localUser?._id;
        let resolvedEmail = localUser?.email;

        try {
          const res = await axios.get("http://localhost:3000/api/auth/me");
          if (res.data && res.data.user) {
            const u = res.data.user;
            setUser({
              fullname: u.fullname || "Student",
              email: u.email || "",
              role: u.role || "user",
              createdAt: u.createdAt || null,
              id: u.id || u._id || null,
            });
            resolvedUserId = u.id || u._id;
            resolvedEmail = u.email;

            // Update localStorage
            localStorage.setItem("user", JSON.stringify(u));
            localStorage.setItem("userRole", u.role);
          }
        } catch (apiErr) {
          console.warn("Could not fetch /api/auth/me, using stored user info", apiErr);
        }

        // 3. Fetch user's registered courses
        try {
          const params = {};
          if (resolvedUserId) params.userId = resolvedUserId;
          else if (resolvedEmail) params.email = resolvedEmail;

          const regRes = await axios.get("http://localhost:3000/api/courses/registrations", {
            params,
          });
          if (Array.isArray(regRes.data)) {
            setRegistrations(regRes.data);
          }
        } catch (regErr) {
          console.warn("Could not fetch user registrations", regErr);
        }
      } catch (err) {
        setError("Failed to load full profile details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndCourses();
  }, []);

  if (loading) {
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center"
        style={{ minHeight: "50vh" }}
      >
        <Spinner animation="border" style={{ color: "#FF8300", width: 48, height: 48 }} />
        <p className="mt-3 text-muted">Fetching your profile details...</p>
      </div>
    );
  }

  const completedCount = registrations.filter(
    (r) => r.progress >= 100 || r.status === "completed"
  ).length;
  const inProgressCount = registrations.length - completedCount;

  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recently Joined";

  return (
    <div className="dashboard-view-wrapper">
      {/* Header Banner */}
      <div
        className="dash-content-card mb-4"
        style={{
          background: "linear-gradient(135deg, rgba(255,131,0,0.12), rgba(0,210,255,0.08))",
          border: "1px solid rgba(255,131,0,0.25)",
        }}
      >
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <img
              src={userAvatar}
              alt={user.fullname}
              style={{
                width: 76,
                height: 76,
                borderRadius: "50%",
                border: "3px solid #FF8300",
                objectFit: "cover",
              }}
            />
            <div>
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <h2 className="mb-0 text-white" style={{ fontSize: "1.6rem", fontWeight: 700 }}>
                  {user.fullname}
                </h2>
                <Badge
                  pill
                  bg={user.role === "admin" ? "danger" : "warning"}
                  className="text-dark px-3 py-1"
                  style={{ fontWeight: 700, fontSize: "12px" }}
                >
                  {user.role === "admin" ? "🛡️ Administrator" : "🎓 Verified Student"}
                </Badge>
              </div>
              <p className="text-muted mb-0 mt-1 d-flex align-items-center gap-2">
                <FaEnvelope size={13} /> {user.email}
              </p>
            </div>
          </div>

          <div className="d-flex gap-2">
            {user.role === "admin" && (
              <Button
                variant="outline-info"
                className="rounded-pill px-3"
                onClick={() => navigate("/admin")}
              >
                Go to Admin Console &rarr;
              </Button>
            )}
            <Button
              className="continue-btn-orange"
              onClick={() => navigate("/dashboard/courses")}
            >
              <FaRocket className="me-2" /> My Courses
            </Button>
          </div>
        </div>
      </div>

      {error && <Alert variant="warning">{error}</Alert>}

      {/* KPI Stats */}
      <Row className="g-3 mb-4">
        <Col md={4} sm={6}>
          <div className="dash-stat-card">
            <span className="dash-stat-label">Enrolled Courses</span>
            <h3 className="dash-stat-value">{registrations.length}</h3>
          </div>
        </Col>
        <Col md={4} sm={6}>
          <div className="dash-stat-card">
            <span className="dash-stat-label">Courses Completed</span>
            <h3 className="dash-stat-value" style={{ color: "#28a745" }}>
              {completedCount}
            </h3>
          </div>
        </Col>
        <Col md={4} sm={12}>
          <div className="dash-stat-card">
            <span className="dash-stat-label">Courses In Progress</span>
            <h3 className="dash-stat-value" style={{ color: "#FF8300" }}>
              {inProgressCount}
            </h3>
          </div>
        </Col>
      </Row>

      {/* Details & Enrolled Courses */}
      <Row className="g-4">
        {/* Account Details */}
        <Col lg={5}>
          <div className="dash-content-card h-100">
            <h4 className="dash-card-title mb-3">
              <FaUser className="me-2" style={{ color: "#FF8300" }} /> Account Information
            </h4>

            <div className="d-flex flex-column gap-3">
              <div className="p-3 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <span className="small text-muted d-block">Full Name</span>
                <strong className="text-white" style={{ fontSize: 15 }}>{user.fullname}</strong>
              </div>

              <div className="p-3 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <span className="small text-muted d-block">Email Address</span>
                <strong className="text-white" style={{ fontSize: 15 }}>{user.email}</strong>
              </div>

              <div className="p-3 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <span className="small text-muted d-block">Account Role</span>
                <strong className="text-white text-capitalize" style={{ fontSize: 15 }}>
                  {user.role}
                </strong>
              </div>

              <div className="p-3 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <span className="small text-muted d-block">Member Since</span>
                <strong className="text-white" style={{ fontSize: 15 }}>
                  <FaCalendarAlt className="me-2" style={{ color: "#00d2ff" }} />
                  {formattedDate}
                </strong>
              </div>

              <div className="p-3 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <span className="small text-muted d-block">Account Status</span>
                <div className="d-flex align-items-center gap-2 mt-1">
                  <span
                    style={{
                      width: 9,
                      height: 9,
                      borderRadius: "50%",
                      background: "#28a745",
                      display: "inline-block",
                      boxShadow: "0 0 8px #28a745",
                    }}
                  />
                  <strong className="text-success" style={{ fontSize: 14 }}>
                    Active &amp; Authenticated
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </Col>

        {/* Enrolled Courses / Activity */}
        <Col lg={7}>
          <div className="dash-content-card h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="dash-card-title mb-0">
                <FaGraduationCap className="me-2" style={{ color: "#FF8300" }} /> Enrolled Courses
              </h4>
              <Button
                size="sm"
                className="continue-btn-orange"
                onClick={() => navigate("/courses")}
              >
                + Browse Courses
              </Button>
            </div>

            {registrations.length === 0 ? (
              <div className="text-center py-5">
                <FaBook size={42} style={{ color: "rgba(255,255,255,0.2)", marginBottom: 12 }} />
                <h6 className="text-white">No courses enrolled yet</h6>
                <p className="text-muted small">
                  Explore our AI-powered courses and enroll in seconds to track your progress!
                </p>
                <Button
                  className="continue-btn-orange mt-2"
                  onClick={() => navigate("/courses")}
                >
                  Explore Course Catalog
                </Button>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {registrations.map((reg, index) => {
                  const isDone = reg.progress >= 100 || reg.status === "completed";
                  const progressVal = isDone ? 100 : reg.progress || 15;
                  const slug = reg.courseSlug || "python";

                  return (
                    <div
                      key={index}
                      className="p-3 rounded"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="d-flex align-items-center gap-2">
                          <FaCheckCircle
                            style={{ color: isDone ? "#28a745" : "#FF8300" }}
                          />
                          <strong className="text-white">{reg.courseName}</strong>
                          {isDone && (
                            <Badge bg="success" className="ms-2">
                              Completed
                            </Badge>
                          )}
                        </div>
                        <span className="small text-muted">
                          {reg.experience || "Beginner"} Level
                        </span>
                      </div>

                      <div className="d-flex align-items-center gap-3 mt-2">
                        <ProgressBar
                          now={progressVal}
                          variant={isDone ? "success" : undefined}
                          className="custom-dash-progressbar flex-grow-1"
                          style={{ height: 8 }}
                        />
                        <span className="small text-white" style={{ minWidth: 40, textAlign: "right" }}>
                          {progressVal}%
                        </span>
                        <Button
                          size="sm"
                          className="btn-outline-dash py-1 px-3"
                          onClick={() => navigate(`/dashboard/roadmap/${slug}`)}
                        >
                          {isDone ? "Review" : "Continue"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;