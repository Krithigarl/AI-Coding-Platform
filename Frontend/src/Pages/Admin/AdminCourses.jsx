import React, { useState } from "react";
import { Row, Col, Modal, Button, Form } from "react-bootstrap";
import {
  FaBook,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaCheck,
  FaLaptopCode,
  FaFire
} from "react-icons/fa";

import pythonImg from "../../assets/python.png";
import javaImg from "../../assets/java.png";
import cppImg from "../../assets/c++.png";
import cImg from "../../assets/c.png";

const initialCourses = [
  {
    id: 1,
    title: "Python Programming",
    slug: "python",
    image: pythonImg,
    level: "Beginner to Advanced",
    topicsCount: 18,
    enrolledCount: 142,
    status: "Published",
    description: "Complete hands-on Python from basics, data structures to OOP and AI integration."
  },
  {
    id: 2,
    title: "JavaScript Mastery",
    slug: "javascript",
    image: cImg,
    level: "All Levels",
    topicsCount: 22,
    enrolledCount: 98,
    status: "Published",
    description: "Master modern ECMAScript, asynchronous programming, DOM manipulation and web apps."
  },
  {
    id: 3,
    title: "Java Development",
    slug: "java",
    image: javaImg,
    level: "Intermediate",
    topicsCount: 16,
    enrolledCount: 76,
    status: "Published",
    description: "Core Java, Collections Framework, Multithreading, and enterprise OOP concepts."
  },
  {
    id: 4,
    title: "C++ Systems Programming",
    slug: "cpp",
    image: cppImg,
    level: "Intermediate to Advanced",
    topicsCount: 14,
    enrolledCount: 54,
    status: "Published",
    description: "High performance computing, memory management, pointers, STL, and algorithms."
  }
];

const AdminCourses = () => {
  const [courses, setCourses] = useState(initialCourses);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: "",
    slug: "",
    level: "Beginner",
    topicsCount: 12,
    description: ""
  });

  const handleAddCourse = (e) => {
    e.preventDefault();
    if (!newCourse.title || !newCourse.slug) return;

    const created = {
      id: Date.now(),
      title: newCourse.title,
      slug: newCourse.slug.toLowerCase(),
      image: pythonImg,
      level: newCourse.level,
      topicsCount: Number(newCourse.topicsCount) || 10,
      enrolledCount: 0,
      status: "Published",
      description: newCourse.description || "Exciting new coding track for aspiring developers."
    };

    setCourses([created, ...courses]);
    setShowAddModal(false);
    setNewCourse({
      title: "",
      slug: "",
      level: "Beginner",
      topicsCount: 12,
      description: ""
    });
    alert(`Course "${created.title}" successfully added to catalog!`);
  };

  const handleDeleteCourse = (id) => {
    if (window.confirm("Are you sure you want to remove this course from the catalog?")) {
      setCourses(courses.filter((c) => c.id !== id));
    }
  };

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-courses-view">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Course Management 📚</h2>
          <p className="admin-page-desc">
            Add new programming tracks, configure roadmap chapters, and inspect student enrollments.
          </p>
        </div>
        <button className="admin-btn-primary" onClick={() => setShowAddModal(true)}>
          <FaPlus /> Create Track
        </button>
      </div>

      {/* Search Bar */}
      <div className="admin-panel mb-4 py-3">
        <div className="d-flex align-items-center gap-3">
          <div className="position-relative flex-grow-1">
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
              placeholder="Search courses by name or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <span className="small text-muted text-nowrap">
            Showing {filteredCourses.length} tracks
          </span>
        </div>
      </div>

      {/* Courses Cards Grid */}
      <Row className="g-4">
        {filteredCourses.map((course) => (
          <Col lg={6} key={course.id}>
            <div className="admin-panel h-100 position-relative">
              <div className="d-flex align-items-start gap-3">
                <div
                  style={{
                    width: 58,
                    height: 58,
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 8
                  }}
                >
                  <img src={course.image} alt={course.title} width={42} height={42} />
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <h5 className="text-white mb-0 fw-bold">{course.title}</h5>
                    <span className="admin-badge badge-active">
                      <FaCheck /> {course.status}
                    </span>
                  </div>
                  <div className="small text-muted mb-2">Slug: <code>{course.slug}</code></div>
                  <p className="small text-light text-opacity-75 mb-3">
                    {course.description}
                  </p>

                  <div className="d-flex align-items-center gap-3 small text-muted mb-3 flex-wrap">
                    <span className="admin-badge badge-course">{course.level}</span>
                    <span><FaLaptopCode className="me-1" /> {course.topicsCount} Topics</span>
                    <span><FaFire className="me-1 text-warning" /> {course.enrolledCount} Students</span>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      className="admin-btn-sm admin-btn-outline"
                      onClick={() => alert(`Roadmap editor for ${course.title} opened.`)}
                    >
                      <FaEdit /> Edit Chapters
                    </button>
                    <button
                      className="admin-btn-sm admin-btn-danger-sm"
                      onClick={() => handleDeleteCourse(course.id)}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Add New Course Modal */}
      <Modal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        centered
        className="admin-modal"
      >
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>Add New Programming Course</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddCourse}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Course Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., Rust Systems Programming"
                required
                value={newCourse.title}
                onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>URL Slug</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., rust"
                required
                value={newCourse.slug}
                onChange={(e) => setNewCourse({ ...newCourse, slug: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Target Level</Form.Label>
              <Form.Select
                value={newCourse.level}
                onChange={(e) => setNewCourse({ ...newCourse, level: e.target.value })}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="All Levels">All Levels</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Estimated Topics</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={newCourse.topicsCount}
                onChange={(e) => setNewCourse({ ...newCourse, topicsCount: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Summary of skills taught in this track..."
                value={newCourse.description}
                onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button type="submit" className="admin-btn-primary">
              Publish Course
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminCourses;
