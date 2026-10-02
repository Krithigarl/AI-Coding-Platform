import React, { useState, useEffect } from "react";
import { Row, Col, Form } from "react-bootstrap";
import {
  FaClipboardList,
  FaSearch,
  FaTrash,
  FaEnvelope,
  FaPhoneAlt,
  FaGraduationCap,
  FaCheckCircle,
  FaDownload
} from "react-icons/fa";
import axios from "axios";

const defaultRegistrations = [
  {
    _id: "r1",
    fullname: "Krithiga R.",
    email: "krithiga@example.com",
    phone: "+91 9876543210",
    education: "B.Tech Computer Science",
    experience: "Intermediate",
    learningGoal: "Master AI full-stack development and algorithms",
    courseName: "Python Programming",
    courseSlug: "python",
    createdAt: "2026-04-10T11:00:00Z"
  },
  {
    _id: "r2",
    fullname: "Rahul Sharma",
    email: "rahul.s@example.com",
    phone: "+91 9123456780",
    education: "MCA 2nd Year",
    experience: "Beginner",
    learningGoal: "Transition into web development and fullstack engineering",
    courseName: "JavaScript Mastery",
    courseSlug: "javascript",
    createdAt: "2026-04-12T09:30:00Z"
  },
  {
    _id: "r3",
    fullname: "Ananya Patel",
    email: "ananya.p@college.edu",
    phone: "+91 9988776655",
    education: "B.Sc Information Tech",
    experience: "Intermediate",
    learningGoal: "Build enterprise services and microservices",
    courseName: "Java Development",
    courseSlug: "java",
    createdAt: "2026-04-14T15:45:00Z"
  }
];

const AdminRegistrations = () => {
  const [registrations, setRegistrations] = useState(defaultRegistrations);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/api/courses/registrations");
      if (res.data && res.data.length > 0) {
        setRegistrations(res.data);
      }
    } catch (err) {
      console.log("Using default registrations data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this course enrollment record?")) {
      try {
        await axios.delete(`http://localhost:3000/api/admin/registrations/${id}`);
      } catch (err) {
        // continue
      }
      setRegistrations(registrations.filter((r) => r._id !== id));
    }
  };

  const exportCSV = () => {
    if (registrations.length === 0) return;
    const headers = "Name,Email,Phone,Course,Education,Experience,Date\n";
    const rows = registrations
      .map(
        (r) =>
          `"${r.fullname}","${r.email}","${r.phone}","${r.courseName || r.courseSlug}","${r.education}","${r.experience}","${r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `codegenius_enrollments_${Date.now()}.csv`;
    a.click();
  };

  const filtered = registrations.filter((r) => {
    const matchesSearch =
      (r.fullname || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.courseName || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.phone || "").includes(search);

    const matchesCourse =
      courseFilter === "all" ||
      (r.courseSlug || "").toLowerCase() === courseFilter.toLowerCase() ||
      (r.courseName || "").toLowerCase().includes(courseFilter.toLowerCase());

    return matchesSearch && matchesCourse;
  });

  return (
    <div className="admin-registrations-view">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Course Registrations 📋</h2>
          <p className="admin-page-desc">
            All submitted applications from the Course Registration Form stored directly in MongoDB.
          </p>
        </div>
        <button className="admin-btn-primary" onClick={exportCSV}>
          <FaDownload /> Export CSV
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-panel mb-4 py-3">
        <Row className="g-3 align-items-center">
          <Col md={8}>
            <div className="position-relative">
              <FaSearch className="position-absolute text-muted" style={{ left: 16, top: 12 }} />
              <input
                type="text"
                className="form-control ps-5"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fff",
                  borderRadius: "10px"
                }}
                placeholder="Search by student name, email, or contact number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </Col>
          <Col md={4}>
            <Form.Select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#fff",
                borderRadius: "10px"
              }}
            >
              <option value="all" style={{ background: "#0c1322" }}>All Courses</option>
              <option value="python" style={{ background: "#0c1322" }}>Python</option>
              <option value="javascript" style={{ background: "#0c1322" }}>JavaScript</option>
              <option value="java" style={{ background: "#0c1322" }}>Java</option>
              <option value="cpp" style={{ background: "#0c1322" }}>C++</option>
            </Form.Select>
          </Col>
        </Row>
      </div>

      {/* Registrations Table Panel */}
      <div className="admin-panel">
        <div className="admin-panel-header">
          <h4 className="admin-panel-title">
            <FaClipboardList style={{ color: "#ff7a00" }} />
            Application Records ({filtered.length})
          </h4>
        </div>

        <div className="admin-table-container">
          {filtered.length === 0 ? (
            <div className="text-center py-5 text-muted">
              {loading ? "Loading registrations..." : "No registrations match your search criteria."}
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Student Info</th>
                  <th>Course Applied</th>
                  <th>Background</th>
                  <th>Experience</th>
                  <th>Learning Goal</th>
                  <th>Date</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((reg) => (
                  <tr key={reg._id}>
                    <td>
                      <div className="fw-bold text-white">{reg.fullname}</div>
                      <div className="small text-muted d-flex align-items-center gap-1">
                        <FaEnvelope style={{ fontSize: 10 }} /> {reg.email}
                      </div>
                      {reg.phone && (
                        <div className="small text-muted d-flex align-items-center gap-1">
                          <FaPhoneAlt style={{ fontSize: 10 }} /> {reg.phone}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="admin-badge badge-course">
                        {reg.courseName || reg.courseSlug}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-1 small text-light">
                        <FaGraduationCap className="text-info" />
                        <span>{reg.education || "Not specified"}</span>
                      </div>
                    </td>
                    <td>
                      <span className="admin-badge badge-user">
                        {reg.experience || "Beginner"}
                      </span>
                    </td>
                    <td>
                      <div
                        className="small text-muted text-truncate"
                        style={{ maxWidth: "200px" }}
                        title={reg.learningGoal}
                      >
                        {reg.learningGoal || "Self-development"}
                      </div>
                    </td>
                    <td className="text-muted small">
                      {reg.createdAt ? new Date(reg.createdAt).toLocaleDateString() : "Active"}
                    </td>
                    <td className="text-end">
                      <button
                        className="admin-btn-sm admin-btn-danger-sm"
                        onClick={() => handleDelete(reg._id)}
                        title="Delete Registration"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminRegistrations;
