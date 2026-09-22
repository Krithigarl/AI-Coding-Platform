import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Spinner, Alert } from "react-bootstrap";
import { FaCheck, FaCheckCircle, FaCode } from "react-icons/fa";
import axios from "axios";

import pythonImg from "../assets/python.png";
import javaImg from "../assets/java.png";
import cppImg from "../assets/c++.png";
import cImg from "../assets/c.png";
import htmlImg from "../assets/html.png";
import cssImg from "../assets/css.png";

const courseImageMap = {
  python: { name: "Python Programming", img: pythonImg },
  java: { name: "Java Programming", img: javaImg },
  "c++": { name: "C++ Programming", img: cppImg },
  cpp: { name: "C++ Programming", img: cppImg },
  c: { name: "C Programming", img: cImg },
  html: { name: "HTML5 Web Structure", img: htmlImg },
  css: { name: "Modern CSS Styling", img: cssImg }
};

const CourseregisterForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const activeSlug = (id || "python").toLowerCase();
  const currentCourseInfo = courseImageMap[activeSlug] || {
    name: `${activeSlug.toUpperCase()} Programming`,
    img: pythonImg
  };

  const [courseDetails, setCourseDetails] = useState({
    name: currentCourseInfo.name,
    slug: activeSlug,
    image: currentCourseInfo.img,
    level: "Beginner → Advanced • Self-paced"
  });

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    education: "Select education",
    experience: "Beginner",
    learningGoal: ""
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Pre-fill user data if logged in
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setFormData((prev) => ({
          ...prev,
          fullname: prev.fullname || parsed || ""
        }));
      }
    } catch {
      // ignore
    }

    // Try fetching course name from backend if available
    if (id) {
      axios
        .get(`http://localhost:3000/api/courses/${id}`)
        .then((res) => {
          if (res.data) {
            setCourseDetails((prev) => ({
              ...prev,
              name: `${res.data.language} Programming`,
              slug: res.data.slug || activeSlug
            }));
          }
        })
        .catch(() => {
          // fallback to default map
        });
    }
  }, [id, activeSlug]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!formData.fullname.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }
    if (!formData.email.trim()) {
      setErrorMsg("Please enter your email address.");
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMsg("Please enter your phone number.");
      return;
    }
    if (formData.education === "Select education") {
      setErrorMsg("Please select your education level.");
      return;
    }

    let userId = null;
    try {
      const storedId = localStorage.getItem("userId");
      if (storedId) userId = JSON.parse(storedId);
    } catch {
      // ignore
    }

    const payload = {
      fullname: formData.fullname,
      email: formData.email,
      phone: formData.phone,
      education: formData.education,
      experience: formData.experience,
      learningGoal: formData.learningGoal,
      courseSlug: courseDetails.slug,
      courseName: courseDetails.name,
      userId: userId
    };

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/courses/register",
        payload
      );

      setSuccessMsg(
        response.data.message || `Successfully enrolled in ${courseDetails.name}!`
      );

      // Redirect to dashboard after 1.2s
      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);
    } catch (err) {
      console.error("Enrollment error:", err);
      setErrorMsg(
        err.response?.data?.message ||
          "Could not save enrollment to database. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="course-register-page-bg">
      <Container className="py-4">
        {/* Top Header */}
        <div className="register-top-header mb-3">
          <div className="brand-left">
            <div className="brand-icon-box">
              <FaCode />
            </div>
            <div>
              <h4 className="brand-title mb-0">CodeGenius</h4>
              <small className="brand-subtitle">AI Coding Learning Platform</small>
            </div>
          </div>
          <div className="free-enrollment-badge">Free Enrollment</div>
        </div>

        {/* Main Enrollment Card */}
        <div className="register-main-card">
          {/* Course Highlight Banner */}
          <div className="course-banner-box mb-4">
            <div className="course-logo-card">
              <img
                src={courseDetails.image}
                alt={courseDetails.name}
                className="img-fluid"
              />
            </div>
            <div className="course-details-wrap">
              <h3 className="course-title-text">{courseDetails.name}</h3>
              <p className="course-level-sub">{courseDetails.level}</p>
              <div className="course-tag-pills">
                <span className="pill-tag green">Free</span>
                <span className="pill-tag dark">Certificate</span>
                <span className="pill-tag blue">AI Mentor</span>
              </div>
            </div>
          </div>

          {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
          {successMsg && <Alert variant="success">{successMsg}</Alert>}

          {/* Form */}
          <Form onSubmit={handleSubmit}>
            {/* Full Name */}
            <Form.Group className="mb-3">
              <Form.Label className="field-label">Full Name</Form.Label>
              <Form.Control
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="custom-dark-input"
                required
              />
            </Form.Group>

            {/* Email & Phone */}
            <Row className="g-3 mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="field-label">Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="custom-dark-input"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="field-label">Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="custom-dark-input"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Education & Experience */}
            <Row className="g-3 mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="field-label">Education</Form.Label>
                  <Form.Select
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    className="custom-dark-input"
                    required
                  >
                    <option value="Select education" disabled>
                      Select education
                    </option>
                    <option value="High School">High School / Higher Secondary</option>
                    <option value="Bachelor's Degree">Bachelor's Degree</option>
                    <option value="Master's Degree">Master's Degree</option>
                    <option value="Working Professional">Working Professional</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="field-label">
                    Programming Experience
                  </Form.Label>
                  <Form.Select
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="custom-dark-input"
                    required
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {/* Learning Goal */}
            <Form.Group className="mb-4">
              <Form.Label className="field-label">
                Why do you want to learn this course?
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="learningGoal"
                value={formData.learningGoal}
                onChange={handleChange}
                placeholder="Write your learning goal..."
                className="custom-dark-input"
              />
            </Form.Group>

            {/* Course Benefits Box */}
            <div className="course-benefits-box mb-4">
              <div className="benefits-heading">
                <FaCheckCircle className="benefits-icon" />
                <span>Course Benefits</span>
              </div>
              <Row className="g-2">
                <Col sm={6}>
                  <div className="benefit-item">
                    <FaCheck className="benefit-check" />
                    <span>Free Enrollment</span>
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="benefit-item">
                    <FaCheck className="benefit-check" />
                    <span>AI Mentor Support</span>
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="benefit-item">
                    <FaCheck className="benefit-check" />
                    <span>Coding Practice</span>
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="benefit-item">
                    <FaCheck className="benefit-check" />
                    <span>Certificate</span>
                  </div>
                </Col>
              </Row>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="btn-enroll-now w-100"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Saving to Database...
                </>
              ) : (
                "Enroll Now"
              )}
            </Button>
          </Form>
        </div>
      </Container>
    </div>
  );
};

export default CourseregisterForm;