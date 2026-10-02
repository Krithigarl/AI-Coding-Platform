import React, { useState } from "react";
import { Form, Button, Alert, Spinner, Modal } from "react-bootstrap";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
  FaKey,
  FaCheckCircle,
  FaInfoCircle
} from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";
import { useLocation, useNavigate } from "react-router-dom";

const LoginForm = ({ setIsLogin }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const savedEmail = Cookies.get("rememberedEmail");
  const [loginData, setLoginData] = useState({
    email: savedEmail || "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(Boolean(savedEmail));
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const updateForm = (e) => {
    const { name, value } = e.target;
    setErrorMsg("");
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const saveAndRedirect = (userData, role) => {
    const userObj = {
      fullname:
        userData.user?.fullname ||
        userData.user?.name ||
        (role === "admin" ? "Administrator" : "Student"),
      id: userData.user?.id || userData.user?._id || null,
      email: userData.user?.email || loginData.email,
      role,
    };

    localStorage.setItem("token", userData.token);
    localStorage.setItem("user", JSON.stringify(userObj));
    localStorage.setItem("userId", JSON.stringify(userObj.id));
    localStorage.setItem("userRole", role);

    if (rememberMe) {
      Cookies.set("rememberedEmail", loginData.email, { expires: 30 });
    } else {
      Cookies.remove("rememberedEmail");
    }

    setTimeout(() => {
      if (role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        const redirectTo =
          location.state?.from &&
          !location.state?.from.startsWith("/admin") &&
          location.state?.from !== "/login"
            ? location.state.from
            : "/dashboard";
        navigate(redirectTo, { replace: true });
      }
    }, 600);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!loginData.email || !loginData.password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", loginData);

      // User's role is retrieved from MongoDB via the backend authentication response
      const role = res.data.user?.role || "user";

      setSuccessMsg(
        role === "admin"
          ? "Admin verified! Redirecting to Admin Dashboard..."
          : "Welcome back! Loading your learning dashboard..."
      );
      saveAndRedirect(res.data, role);
    } catch (error) {
      const serverMsg = error.response?.data?.message;
      if (serverMsg) {
        setErrorMsg(serverMsg);
      } else if (error.request) {
        setErrorMsg("Cannot connect to server. Please verify backend service is running on port 3000.");
      } else {
        setErrorMsg("Login failed. Please verify your credentials and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSubmitted(true);
    setTimeout(() => {
      setForgotSubmitted(false);
      setShowForgotModal(false);
      setForgotEmail("");
    }, 3500);
  };

  return (
    <div className="form-section real-form-section">
      <div className="form-header-area mb-4">
        {/* <div className="d-flex align-items-center gap-2 mb-2">
          <span className="form-badge-icon">
            <FaKey />
          </span>
          <span className="form-portal-tag">Secure Portal Access</span>
        </div> */}
        <h2 className="form-main-heading">Sign In to CodeGenius</h2>
        <p className="form-sub-heading">
          Access your courses, AI code mentor, real-time sandboxes, and learning progress.
        </p>
      </div>

      {errorMsg && (
        <Alert variant="danger" className="py-2 px-3 modern-alert d-flex align-items-center gap-2">
          <FaInfoCircle className="flex-shrink-0" />
          <span>{errorMsg}</span>
        </Alert>
      )}

      {successMsg && (
        <Alert variant="success" className="py-2 px-3 modern-alert d-flex align-items-center gap-2">
          <FaCheckCircle className="flex-shrink-0" />
          <span>{successMsg}</span>
        </Alert>
      )}

      <Form onSubmit={handleLogin} className="auth-form-body">
        {/* Email Field */}
        <Form.Group className="mb-3">
          <Form.Label className="auth-input-label">
            <FaEnvelope className="me-2 text-warning" />
            <span>Email Address</span>
          </Form.Label>
          <div className="auth-input-wrapper">
            <Form.Control
              type="email"
              name="email"
              value={loginData.email}
              onChange={updateForm}
              placeholder="name@example.com"
              disabled={loading}
              className="auth-input-field"
              required
              autoComplete="email"
            />
          </div>
        </Form.Group>

        {/* Password Field with Show/Hide Toggle */}
        <Form.Group className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <Form.Label className="auth-input-label mb-0">
              <FaLock className="me-2 text-warning" />
              <span>Password</span>
            </Form.Label>
            <button
              type="button"
              className="forgot-link-btn"
              onClick={() => setShowForgotModal(true)}
            >
              Forgot password?
            </button>
          </div>
          <div className="auth-input-wrapper position-relative">
            <Form.Control
              type={showPassword ? "text" : "password"}
              name="password"
              value={loginData.password}
              onChange={updateForm}
              placeholder="Enter your account password"
              disabled={loading}
              className="auth-input-field pe-5"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </Form.Group>

        {/* Remember Me Checkbox & Role Auto-detect Info */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <Form.Check
            type="checkbox"
            id="remember-me"
            label="Remember me on this device"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="auth-checkbox small"
          />
          <span className="auth-role-pill">
            <FaShieldAlt className="me-1 text-info" /> Role Auto-Routed
          </span>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="login-btn w-100 mb-3 submit-action-btn"
          disabled={loading}
        >
          {loading ? (
            <span className="d-flex align-items-center justify-content-center gap-2">
              <Spinner animation="border" size="sm" />
             Logging In...
            </span>
          ) : (
            "Sign In to Workspace"
          )}
        </Button>

        {/* Bottom Switcher */}
        {setIsLogin && (
          <div className="text-center pt-2 border-top border-secondary border-opacity-25 mt-3">
            <span className="small">Don't have an account yet? </span>
            <button
              type="button"
              className="switch-form-link"
              onClick={() => setIsLogin(false)}
            >
              Create Account Free
            </button>
          </div>
        )}
      </Form>

      {/* Security Guarantee Footer
      <div className="auth-security-footer mt-4 text-center">
        <span className="security-icon-tag">
          <FaShieldAlt className="me-1 text-success" /> End-to-End SSL &amp; JWT Protected Session
        </span>
      </div> */}

      {/* Forgot Password Modal */}
      <Modal
        show={showForgotModal}
        onHide={() => setShowForgotModal(false)}
        centered
        contentClassName="auth-modal-content"
      >
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title className="h5 text-white d-flex align-items-center gap-2">
            <FaKey style={{ color: "#FF8300" }} /> Password Recovery
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4">
          {forgotSubmitted ? (
            <div className="text-center py-3">
              <FaCheckCircle size={48} className="text-success mb-3" />
              <h5 className="text-white">Recovery Email Sent</h5>
              <p className="small mb-0">
                If an account exists with <strong>{forgotEmail}</strong>, instructions to reset your password have been dispatched.
              </p>
            </div>
          ) : (
            <Form onSubmit={handleForgotSubmit}>
              <p className="small mb-3">
                Enter your registered email address and we'll send you a secure verification link to reset your account password.
              </p>
              <Form.Group className="mb-3">
                <Form.Label className="text-white small">Your Registered Email</Form.Label>
                <Form.Control
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="auth-input-field"
                  required
                />
              </Form.Group>
              <Button type="submit" className="login-btn w-100">
                Send Reset Instructions
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default LoginForm;