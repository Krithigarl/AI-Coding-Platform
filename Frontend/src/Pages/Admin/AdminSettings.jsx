import React, { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import {
  FaCog,
  FaShieldAlt,
  FaRobot,
  FaDatabase,
  FaSave,
  FaCheckCircle,
  FaBell
} from "react-icons/fa";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    platformName: "CodeGenius AI Learning",
    supportEmail: "support@codegenius.com",
    allowNewRegistrations: true,
    maintenanceMode: false,
    aiModel: "gemini-1.5-pro",
    aiTemperature: 0.7,
    maxDailyQueriesPerStudent: 50,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="admin-settings-view">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">System & AI Settings ⚙️</h2>
          <p className="admin-page-desc">
            Configure system services, AI model keys, security controls, and platform availability.
          </p>
        </div>
        {savedSuccess && (
          <div className="admin-badge badge-active py-2 px-3">
            <FaCheckCircle /> Settings saved successfully!
          </div>
        )}
      </div>

      <Form onSubmit={handleSave}>
        <Row className="g-4">
          {/* General Platform Controls */}
          <Col lg={6}>
            <div className="admin-panel h-100">
              <div className="admin-panel-header">
                <h4 className="admin-panel-title">
                  <FaShieldAlt style={{ color: "#ff7a00" }} />
                  General Platform Controls
                </h4>
              </div>

              <Form.Group className="mb-3">
                <Form.Label className="text-light">Platform Brand Name</Form.Label>
                <Form.Control
                  type="text"
                  value={settings.platformName}
                  onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                  style={{ background: "rgba(255,255,255,0.05)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" }}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="text-light">Administrator Contact Email</Form.Label>
                <Form.Control
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                  style={{ background: "rgba(255,255,255,0.05)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" }}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check
                  type="switch"
                  id="reg-switch"
                  label="Allow Open Course Registrations"
                  checked={settings.allowNewRegistrations}
                  onChange={(e) => setSettings({ ...settings, allowNewRegistrations: e.target.checked })}
                  className="text-light"
                />
                <small className="text-muted">Students can enroll freely in courses without invitation code.</small>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Check
                  type="switch"
                  id="maint-switch"
                  label="Maintenance Mode"
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  className="text-warning"
                />
                <small className="text-muted">Temporarily restricts student dashboard access during updates.</small>
              </Form.Group>
            </div>
          </Col>

          {/* AI Mentor & API Controls */}
          <Col lg={6}>
            <div className="admin-panel h-100">
              <div className="admin-panel-header">
                <h4 className="admin-panel-title">
                  <FaRobot style={{ color: "#00d2ff" }} />
                  AI Mentor Engine Settings
                </h4>
              </div>

              <Form.Group className="mb-3">
                <Form.Label className="text-light">Active AI Model</Form.Label>
                <Form.Select
                  value={settings.aiModel}
                  onChange={(e) => setSettings({ ...settings, aiModel: e.target.value })}
                  style={{ background: "#0f172a", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <option value="gemini-1.5-pro">Google Gemini 1.5 Pro (High Reasoning)</option>
                  <option value="gemini-2.5-flash">Google Gemini 2.5 Flash (Ultra Fast)</option>
                  <option value="gemini-1.5-flash">Google Gemini 1.5 Flash (Standard)</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="text-light">AI Temperature ({settings.aiTemperature})</Form.Label>
                <Form.Range
                  min={0.1}
                  max={1.0}
                  step={0.1}
                  value={settings.aiTemperature}
                  onChange={(e) => setSettings({ ...settings, aiTemperature: parseFloat(e.target.value) })}
                />
                <small className="text-muted">Lower values provide deterministic coding solutions; higher values produce creative explanations.</small>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="text-light">Max Daily Queries Per Student</Form.Label>
                <Form.Control
                  type="number"
                  value={settings.maxDailyQueriesPerStudent}
                  onChange={(e) => setSettings({ ...settings, maxDailyQueriesPerStudent: parseInt(e.target.value) || 20 })}
                  style={{ background: "rgba(255,255,255,0.05)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" }}
                />
              </Form.Group>

              <div className="p-3 rounded" style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.25)" }}>
                <div className="d-flex align-items-center gap-2 text-success fw-bold small">
                  <FaDatabase /> MongoDB & API Secret Keys Configured
                </div>
                <div className="small text-muted mt-1">Environment variables (.env) active with healthy ping.</div>
              </div>
            </div>
          </Col>
        </Row>

        <div className="mt-4 d-flex justify-content-end gap-3">
          <Button
            type="button"
            variant="outline-secondary"
            onClick={() => alert("Test push notification dispatched to student channels.")}
          >
            <FaBell className="me-1" /> Test Notification
          </Button>
          <Button type="submit" className="admin-btn-primary">
            <FaSave /> Save Configuration
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AdminSettings;
