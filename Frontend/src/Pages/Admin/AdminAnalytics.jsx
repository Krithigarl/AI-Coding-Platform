import React from "react";
import { Row, Col, ProgressBar } from "react-bootstrap";
import {
  FaChartLine,
  FaRobot,
  FaCode,
  FaCheckCircle,
  FaTrophy,
  FaLaptopCode,
  FaFire
} from "react-icons/fa";

const AdminAnalytics = () => {
  return (
    <div className="admin-analytics-view">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Platform & AI Analytics 📈</h2>
          <p className="admin-page-desc">
            Deep-dive metrics on student code executions, AI mentor utilization, and curriculum mastery.
          </p>
        </div>
      </div>

      {/* Top 3 Metric Cards */}
      <Row className="g-3 mb-4">
        <Col md={4}>
          <div className="admin-stat-card">
            <div className="admin-stat-card-top">
              <span className="admin-stat-card-label">Code Runs Today</span>
              <div className="admin-stat-icon-wrap cyan">
                <FaCode />
              </div>
            </div>
            <h3 className="admin-stat-number">3,892</h3>
            <div className="admin-stat-trend">
              <FaCheckCircle /> 94.2% test suite success rate
            </div>
          </div>
        </Col>

        <Col md={4}>
          <div className="admin-stat-card">
            <div className="admin-stat-card-top">
              <span className="admin-stat-card-label">AI Mentor Inquiries</span>
              <div className="admin-stat-icon-wrap orange">
                <FaRobot />
              </div>
            </div>
            <h3 className="admin-stat-number">1,420</h3>
            <div className="admin-stat-trend">
              <FaFire /> Peak hours: 6 PM - 10 PM
            </div>
          </div>
        </Col>

        <Col md={4}>
          <div className="admin-stat-card">
            <div className="admin-stat-card-top">
              <span className="admin-stat-card-label">Avg. Course Completion</span>
              <div className="admin-stat-icon-wrap green">
                <FaTrophy />
              </div>
            </div>
            <h3 className="admin-stat-number">68.4%</h3>
            <div className="admin-stat-trend">
              <FaCheckCircle /> +12% improvement vs last month
            </div>
          </div>
        </Col>
      </Row>

      {/* Analytics Breakdown Panels */}
      <Row className="g-4 mb-4">
        {/* Track Completion Performance */}
        <Col lg={7}>
          <div className="admin-panel h-100">
            <div className="admin-panel-header">
              <h4 className="admin-panel-title">
                <FaLaptopCode style={{ color: "#ff7a00" }} />
                Curriculum Progression By Track
              </h4>
            </div>

            <div className="d-flex flex-column gap-4 pt-2">
              <div>
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-white fw-semibold">Python Programming</span>
                  <span className="text-warning fw-bold">78% Completion Rate</span>
                </div>
                <ProgressBar now={78} variant="warning" style={{ height: 10, background: "rgba(255,255,255,0.08)" }} />
                <div className="small text-muted mt-1">142 active students · 18 total topics</div>
              </div>

              <div>
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-white fw-semibold">JavaScript Mastery</span>
                  <span className="text-info fw-bold">64% Completion Rate</span>
                </div>
                <ProgressBar now={64} variant="info" style={{ height: 10, background: "rgba(255,255,255,0.08)" }} />
                <div className="small text-muted mt-1">98 active students · 22 total topics</div>
              </div>

              <div>
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-white fw-semibold">Java Development</span>
                  <span className="text-primary fw-bold">52% Completion Rate</span>
                </div>
                <ProgressBar now={52} variant="primary" style={{ height: 10, background: "rgba(255,255,255,0.08)" }} />
                <div className="small text-muted mt-1">76 active students · 16 total topics</div>
              </div>

              <div>
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-white fw-semibold">C++ Systems</span>
                  <span className="text-danger fw-bold">44% Completion Rate</span>
                </div>
                <ProgressBar now={44} variant="danger" style={{ height: 10, background: "rgba(255,255,255,0.08)" }} />
                <div className="small text-muted mt-1">54 active students · 14 total topics</div>
              </div>
            </div>
          </div>
        </Col>

        {/* AI Mentor Topic Breakdown */}
        <Col lg={5}>
          <div className="admin-panel h-100">
            <div className="admin-panel-header">
              <h4 className="admin-panel-title">
                <FaRobot style={{ color: "#00d2ff" }} />
                Top AI Mentor Queries
              </h4>
            </div>

            <div className="d-flex flex-column gap-3">
              <div className="p-3 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="text-white fw-semibold">Recursion & Call Stack</span>
                  <span className="admin-badge badge-course">384 asks</span>
                </div>
                <div className="small text-muted">Python & C++ students asking for step-by-step visual trace.</div>
              </div>

              <div className="p-3 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="text-white fw-semibold">Promises & Async/Await</span>
                  <span className="admin-badge badge-course">291 asks</span>
                </div>
                <div className="small text-muted">JavaScript students clarifying event loop microtasks.</div>
              </div>

              <div className="p-3 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="text-white fw-semibold">Pointers & Memory Allocation</span>
                  <span className="admin-badge badge-course">215 asks</span>
                </div>
                <div className="small text-muted">C++ students debugging segmentation faults.</div>
              </div>

              <div className="p-3 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="text-white fw-semibold">OOP Polymorphism & Interfaces</span>
                  <span className="admin-badge badge-course">180 asks</span>
                </div>
                <div className="small text-muted">Java students exploring design patterns.</div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default AdminAnalytics;
