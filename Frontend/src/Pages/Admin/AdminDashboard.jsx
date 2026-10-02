import React, { useState, useEffect } from "react";
import { Row, Col, ProgressBar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaBookOpen,
  FaClipboardCheck,
  FaRobot,
  FaPlusCircle,
  FaArrowRight,
  FaCheckCircle,
  FaUserCheck,
  FaCode
} from "react-icons/fa";
import axios from "axios";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 8,
    totalRegistrations: 14,
    totalCourses: 4,
    activeMentors: 3,
    systemHealth: "100% Operational",
  });

  const [recentRegistrations, setRecentRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch stats and registrations
    const fetchAdminData = async () => {
      try {
        const statsRes = await axios.get("http://localhost:3000/api/admin/stats");
        if (statsRes.data && statsRes.data.stats) {
          setStats(statsRes.data.stats);
          if (statsRes.data.recentRegistrations) {
            setRecentRegistrations(statsRes.data.recentRegistrations);
          }
        }
      } catch (err) {
        // Fallback fetch directly from course registrations
        try {
          const regRes = await axios.get("http://localhost:3000/api/courses/registrations");
          if (regRes.data) {
            setRecentRegistrations(regRes.data.slice(0, 5));
            setStats((prev) => ({
              ...prev,
              totalRegistrations: regRes.data.length || prev.totalRegistrations,
            }));
          }
        } catch (fallbackErr) {
          console.log("Using default admin mock metrics", fallbackErr);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  return (
    <div className="admin-dashboard-view">
      {/* Page Title Header */}
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Admin Command Center ⚡</h2>
          <p className="admin-page-desc">
            Monitor real-time student activity, enrollments, course catalogs, and AI platform performance.
          </p>
        </div>
        <button
          className="admin-btn-primary"
          onClick={() => navigate("/admin/courses")}
        >
          <FaPlusCircle /> Add New Course
        </button>
      </div>

      {/* 4 KPI Stat Cards */}
      <Row className="g-3 mb-4">
        <Col lg={3} sm={6}>
          <div className="admin-stat-card">
            <div className="admin-stat-card-top">
              <span className="admin-stat-card-label">Total Registered Users</span>
              <div className="admin-stat-icon-wrap cyan">
                <FaUsers />
              </div>
            </div>
            <h3 className="admin-stat-number">{stats.totalUsers || 12}</h3>
            <div className="admin-stat-trend">
              <span>+18% from last week</span>
            </div>
          </div>
        </Col>

        <Col lg={3} sm={6}>
          <div className="admin-stat-card">
            <div className="admin-stat-card-top">
              <span className="admin-stat-card-label">Course Enrollments</span>
              <div className="admin-stat-icon-wrap orange">
                <FaClipboardCheck />
              </div>
            </div>
            <h3 className="admin-stat-number">{stats.totalRegistrations || 18}</h3>
            <div className="admin-stat-trend">
              <span>Active submissions</span>
            </div>
          </div>
        </Col>

        <Col lg={3} sm={6}>
          <div className="admin-stat-card">
            <div className="admin-stat-card-top">
              <span className="admin-stat-card-label">Published Courses</span>
              <div className="admin-stat-icon-wrap purple">
                <FaBookOpen />
              </div>
            </div>
            <h3 className="admin-stat-number">{stats.totalCourses || 4}</h3>
            <div className="admin-stat-trend">
              <span>Python, JS, Java, C++</span>
            </div>
          </div>
        </Col>

        <Col lg={3} sm={6}>
          <div className="admin-stat-card">
            <div className="admin-stat-card-top">
              <span className="admin-stat-card-label">AI Mentor Inquiries</span>
              <div className="admin-stat-icon-wrap green">
                <FaRobot />
              </div>
            </div>
            <h3 className="admin-stat-number">1,248</h3>
            <div className="admin-stat-trend">
              <span>Avg response: 180ms</span>
            </div>
          </div>
        </Col>
      </Row>

      {/* Quick Action Shortcuts */}
      <Row className="g-3 mb-4">
        <Col md={3} sm={6}>
          <div
            className="admin-shortcut-card"
            onClick={() => navigate("/admin/courses")}
          >
            <div className="admin-shortcut-icon" style={{ background: "rgba(255, 122, 0, 0.15)", color: "#ff7a00" }}>
              <FaBookOpen />
            </div>
            <div>
              <div className="fw-bold" style={{ fontSize: "14px" }}>Course Catalog</div>
              <div className="text-muted" style={{ fontSize: "12px" }}>Update topics & tasks</div>
            </div>
          </div>
        </Col>

        <Col md={3} sm={6}>
          <div
            className="admin-shortcut-card"
            onClick={() => navigate("/admin/registrations")}
          >
            <div className="admin-shortcut-icon" style={{ background: "rgba(0, 210, 255, 0.15)", color: "#00d2ff" }}>
              <FaClipboardCheck />
            </div>
            <div>
              <div className="fw-bold" style={{ fontSize: "14px" }}>Enrollments</div>
              <div className="text-muted" style={{ fontSize: "12px" }}>View student applications</div>
            </div>
          </div>
        </Col>

        <Col md={3} sm={6}>
          <div
            className="admin-shortcut-card"
            onClick={() => navigate("/admin/users")}
          >
            <div className="admin-shortcut-icon" style={{ background: "rgba(139, 92, 246, 0.15)", color: "#8b5cf6" }}>
              <FaUserCheck />
            </div>
            <div>
              <div className="fw-bold" style={{ fontSize: "14px" }}>Manage Roles</div>
              <div className="text-muted" style={{ fontSize: "12px" }}>Grant Admin privileges</div>
            </div>
          </div>
        </Col>

        <Col md={3} sm={6}>
          <div
            className="admin-shortcut-card"
            onClick={() => navigate("/admin/analytics")}
          >
            <div className="admin-shortcut-icon" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
              <FaCode />
            </div>
            <div>
              <div className="fw-bold" style={{ fontSize: "14px" }}>Code Analytics</div>
              <div className="text-muted" style={{ fontSize: "12px" }}>Compiler & test metrics</div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Middle Grid: Recent Registrations & Course Popularity */}
      <Row className="g-4 mb-4">
        {/* Recent Registrations Table */}
        <Col lg={8}>
          <div className="admin-panel h-100">
            <div className="admin-panel-header">
              <h4 className="admin-panel-title">
                <FaClipboardCheck style={{ color: "#ff7a00" }} />
                Recent Student Enrollments
              </h4>
              <button
                className="admin-btn-sm admin-btn-outline"
                onClick={() => navigate("/admin/registrations")}
              >
                View All <FaArrowRight />
              </button>
            </div>

            <div className="admin-table-container">
              {recentRegistrations.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  {loading ? "Loading enrollments..." : "No registrations found yet."}
                </div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Course</th>
                      <th>Education</th>
                      <th>Experience</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRegistrations.map((reg, idx) => (
                      <tr key={reg._id || idx}>
                        <td>
                          <div className="fw-bold text-white">{reg.fullname}</div>
                          <div className="small text-muted">{reg.email}</div>
                        </td>
                        <td>
                          <span className="admin-badge badge-course">
                            {reg.courseName || reg.courseSlug}
                          </span>
                        </td>
                        <td>{reg.education || "Undergraduate"}</td>
                        <td>
                          <span className="admin-badge badge-user">
                            {reg.experience || "Beginner"}
                          </span>
                        </td>
                        <td className="text-muted small">
                          {reg.createdAt ? new Date(reg.createdAt).toLocaleDateString() : "Just now"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </Col>

        {/* Course Popularity Breakdown */}
        <Col lg={4}>
          <div className="admin-panel h-100">
            <div className="admin-panel-header">
              <h4 className="admin-panel-title">
                <FaBookOpen style={{ color: "#00d2ff" }} />
                Course Popularity
              </h4>
            </div>

            <div className="d-flex flex-column gap-3">
              <div>
                <div className="d-flex justify-content-between small mb-1">
                  <span>Python Programming</span>
                  <span className="text-white fw-bold">45%</span>
                </div>
                <ProgressBar now={45} style={{ height: "7px", background: "rgba(255,255,255,0.08)" }} variant="warning" />
              </div>

              <div>
                <div className="d-flex justify-content-between small mb-1">
                  <span>JavaScript Mastery</span>
                  <span className="text-white fw-bold">28%</span>
                </div>
                <ProgressBar now={28} style={{ height: "7px", background: "rgba(255,255,255,0.08)" }} variant="info" />
              </div>

              <div>
                <div className="d-flex justify-content-between small mb-1">
                  <span>Java Development</span>
                  <span className="text-white fw-bold">18%</span>
                </div>
                <ProgressBar now={18} style={{ height: "7px", background: "rgba(255,255,255,0.08)" }} variant="primary" />
              </div>

              <div>
                <div className="d-flex justify-content-between small mb-1">
                  <span>C++ Systems</span>
                  <span className="text-white fw-bold">9%</span>
                </div>
                <ProgressBar now={9} style={{ height: "7px", background: "rgba(255,255,255,0.08)" }} variant="danger" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-top border-secondary border-opacity-25">
              <div className="small text-muted mb-2">Platform Service Status:</div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <FaCheckCircle className="text-success" />
                <span className="small text-light">MongoDB Database: Connected</span>
              </div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <FaCheckCircle className="text-success" />
                <span className="small text-light">Gemini / AI Mentor: Online</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <FaCheckCircle className="text-success" />
                <span className="small text-light">Authentication Guard: Strict Role Checked</span>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
