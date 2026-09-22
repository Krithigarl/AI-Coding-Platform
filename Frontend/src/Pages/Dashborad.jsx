import React, { useState, useEffect } from "react";
import { Row, Col, ProgressBar, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import axios from "axios";

import python from "../assets/python.png";
import java from "../assets/java.png";
import cpp from "../assets/c++.png";
import c from "../assets/c.png";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Krithiga");
  const [coursesCount, setCoursesCount] = useState(3);

  const enrolledCourses = [
    { name: "Python", image: python, progress: 60, status: "In Progress" },
    { name: "JavaScript", image: c, progress: 45, status: "In Progress" },
    { name: "Java", image: java, progress: 30, status: "In Progress" },
    { name: "C++", image: cpp, progress: 15, status: "Started" }
  ];

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        setUserName(JSON.parse(stored));
      }
    } catch {
      // fallback
    }

    // Query registrations from MongoDB
    let userId = null;
    try {
      const uid = localStorage.getItem("userId");
      if (uid) userId = JSON.parse(uid);
    } catch {
      // ignore
    }

    axios
      .get(`http://localhost:3000/api/courses/registrations${userId ? `?userId=${userId}` : ""}`)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setCoursesCount(Math.max(3, res.data.length));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="dashboard-view-wrapper">
      {/* Welcome Title */}
      <h2 className="dash-welcome-heading">Welcome back, {userName}! 👋</h2>
      <p className="dash-subtitle">Continue your learning journey.</p>

      {/* 4 Stat Cards Row */}
      <Row className="g-3 mb-4">
        <Col lg={3} sm={6}>
          <div className="dash-stat-card">
            <span className="dash-stat-label">Courses Enrolled</span>
            <h3 className="dash-stat-value">{coursesCount}</h3>
          </div>
        </Col>

        <Col lg={3} sm={6}>
          <div className="dash-stat-card">
            <span className="dash-stat-label">Topics Completed</span>
            <h3 className="dash-stat-value">24</h3>
          </div>
        </Col>

        <Col lg={3} sm={6}>
          <div className="dash-stat-card">
            <span className="dash-stat-label">Coding Streak</span>
            <h3 className="dash-stat-value">
              12 <span className="streak-unit">Days</span>
            </h3>
          </div>
        </Col>

        <Col lg={3} sm={6}>
          <div className="dash-stat-card">
            <span className="dash-stat-label">XP Points</span>
            <h3 className="dash-stat-value">450</h3>
          </div>
        </Col>
      </Row>

      {/* Middle Section: Continue Learning + Recent Activity */}
      <Row className="g-4 mb-4">
        {/* Continue Learning Card */}
        <Col lg={6}>
          <div className="dash-content-card">
            <h4 className="dash-card-title">Continue Learning</h4>

            <div className="continue-learning-box">
              <div className="course-hero-row">
                <div className="course-logo-wrap">
                  <img src={python} alt="Python" />
                </div>
                <div className="course-text-details">
                  <span className="course-category-tag">Python Programming</span>
                  <h5 className="course-topic-name">Variables in Python</h5>
                </div>
              </div>

              <div className="course-progress-container">
                <div className="progress-percent-label">60%</div>
                <ProgressBar now={60} className="custom-dash-progressbar" />
              </div>

              <div className="d-flex justify-content-end">
                <Button
                  className="continue-btn-orange"
                  onClick={() => navigate("/dashboard/roadmap/python")}
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        </Col>

        {/* Recent Activity Card */}
        <Col lg={6}>
          <div className="dash-content-card">
            <h4 className="dash-card-title">Recent Activity</h4>

            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-item-left">
                  <FaCheckCircle className="activity-status-dot green" />
                  <div>
                    <div className="activity-text-title">Completed Variables topic</div>
                    <div className="activity-time-stamp">2 hours ago</div>
                  </div>
                </div>
                <span className="activity-chevron">&gt;&gt;</span>
              </div>

              <div className="activity-item">
                <div className="activity-item-left">
                  <FaCheckCircle className="activity-status-dot orange" />
                  <div>
                    <div className="activity-text-title">Solved loop practice</div>
                    <div className="activity-time-stamp">Yesterday</div>
                  </div>
                </div>
                <span className="activity-chevron">&gt;&gt;</span>
              </div>

              <div className="activity-item">
                <div className="activity-item-left">
                  <FaCheckCircle className="activity-status-dot orange" />
                  <div>
                    <div className="activity-text-title">AI Mentor Help</div>
                    <div className="activity-time-stamp">2 days ago</div>
                  </div>
                </div>
                <span className="activity-chevron">&gt;&gt;</span>
              </div>

              <div className="activity-item">
                <div className="activity-item-left">
                  <FaCheckCircle className="activity-status-dot orange" />
                  <div>
                    <div className="activity-text-title">Completed Quiz: Operators</div>
                    <div className="activity-time-stamp">3 days ago</div>
                  </div>
                </div>
                <span className="activity-chevron">&gt;&gt;</span>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Bottom Section: My Courses */}
      <div className="dash-content-card">
        <h4 className="dash-card-title">My Courses</h4>

        <Row className="g-3 mt-1">
          {enrolledCourses.map((course, index) => (
            <Col xl={3} md={6} key={index}>
              <div className="dash-course-grid-card">
                <div className="course-icon-holder mb-2">
                  <img src={course.image} alt={course.name} width={48} height={48} />
                </div>
                <h6 className="course-card-name">{course.name}</h6>
                <div className="small text-muted mb-2">{course.status}</div>
                <ProgressBar now={course.progress} className="custom-dash-progressbar mb-3" />
                <Button
                  size="sm"
                  className="w-100 btn-outline-dash"
                  onClick={() => {
                    const slug = course.name === "C++" ? "cpp" : course.name.toLowerCase();
                    navigate(`/dashboard/roadmap/${slug}`);
                  }}
                >
                  View Roadmap
                </Button>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default Dashboard;