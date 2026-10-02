import React, { useState } from "react";
import { Form, Button, Alert, Spinner, ProgressBar } from "react-bootstrap";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
  FaUserPlus,
  FaCheckCircle,
  FaInfoCircle
} from "react-icons/fa";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const RegisterForm = ({ setIsLogin }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const updateData = (e) => {
    const { name, value } = e.target;
    setErrorMsg("");
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  // Password strength calculation
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: "", variant: "secondary" };
    let score = 0;
    if (pwd.length >= 6) score += 25;
    if (pwd.length >= 10) score += 25;
    if (/[A-Z]/.test(pwd)) score += 20;
    if (/[0-9]/.test(pwd)) score += 15;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 15;

    if (score < 40) return { score, label: "Weak password", variant: "danger" };
    if (score < 75) return { score, label: "Medium strength", variant: "warning" };
    return { score, label: "Strong password", variant: "success" };
  };

  const strength = getPasswordStrength(registerData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!registerData.fullname.trim() || !registerData.email.trim() || !registerData.password) {
      setErrorMsg("All fields are required to register.");
      return;
    }

    if (registerData.password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    if (!agreedTerms) {
      setErrorMsg("Please accept the Terms of Service to create an account.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/register",
        registerData
      );

      // Newly registered users always have role: "user"
      const role = res.data.user?.role || "user";

      const userObj = {
        fullname: res.data.user?.fullname || registerData.fullname,
        id: res.data.user?.id || res.data.user?._id || null,
        email: res.data.user?.email || registerData.email,
        role,
      };

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(userObj));
      localStorage.setItem("userId", JSON.stringify(userObj.id));
      localStorage.setItem("userRole", role);

      setSuccessMsg(
        "Account created successfully! Preparing your learning dashboard..."
      );

      setTimeout(() => {
        const redirectTo = location.state?.from && !location.state.from.startsWith("/admin")
          ? location.state.from
          : "/dashboard";
        navigate(redirectTo, { replace: true });
      }, 700);
    } catch (error) {
      const serverMsg = error.response?.data?.message;
      if (serverMsg) {
        setErrorMsg(serverMsg);
      } else if (error.request) {
        setErrorMsg("Server is unreachable. Please verify backend service on port 3000.");
      } else {
        setErrorMsg("Registration failed. Please try again with another email.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-section real-form-section">
      <div className="form-header-area mb-4">
        {/* <div className="d-flex align-items-center gap-2 mb-2">
          <span className="form-badge-icon">
            <FaUserPlus />
          </span>
          <span className="form-portal-tag">New Account Registration</span>
        </div> */}
        <h2 className="form-main-heading">Create Free Account</h2>
        <p className="form-sub-heading">
          Join thousands of developers mastering algorithms, systems programming, and AI tools.
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

      <Form onSubmit={handleSubmit} className="auth-form-body">
        {/* Full Name */}
        <Form.Group className="mb-3">
          <Form.Label className="auth-input-label">
            <FaUser className="me-2 text-warning" />
            <span>Full Name</span>
          </Form.Label>
          <div className="auth-input-wrapper">
            <Form.Control
              type="text"
              name="fullname"
              value={registerData.fullname}
              onChange={updateData}
              placeholder="e.g. Alex Johnson"
              disabled={loading}
              className="auth-input-field"
              required
              autoComplete="name"
            />
          </div>
        </Form.Group>

        {/* Email */}
        <Form.Group className="mb-3">
          <Form.Label className="auth-input-label">
            <FaEnvelope className="me-2 text-warning" />
            <span>Email Address</span>
          </Form.Label>
          <div className="auth-input-wrapper">
            <Form.Control
              type="email"
              name="email"
              value={registerData.email}
              onChange={updateData}
              placeholder="name@example.com"
              disabled={loading}
              className="auth-input-field"
              required
              autoComplete="email"
            />
          </div>
        </Form.Group>

        {/* Password */}
        <Form.Group className="mb-2">
          <Form.Label className="auth-input-label">
            <FaLock className="me-2 text-warning" />
            <span>Create Password</span>
          </Form.Label>
          <div className="auth-input-wrapper position-relative">
            <Form.Control
              type={showPassword ? "text" : "password"}
              name="password"
              value={registerData.password}
              onChange={updateData}
              placeholder="At least 6 characters"
              disabled={loading}
              className="auth-input-field pe-5"
              required
              autoComplete="new-password"
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

        {/* Password Strength Meter */}
        {registerData.password && (
          <div className="mb-3 px-1">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="small text-muted" style={{ fontSize: "11px" }}>
                Security Strength
              </span>
              <span
                className={`small text-${strength.variant}`}
                style={{ fontSize: "11px", fontWeight: 600 }}
              >
                {strength.label}
              </span>
            </div>
            <ProgressBar
              now={strength.score}
              variant={strength.variant}
              style={{ height: 4, borderRadius: 2 }}
            />
          </div>
        )}

        {/* Terms Checkbox */}
        <Form.Group className="mb-4">
          <Form.Check
            type="checkbox"
            id="agree-terms"
            checked={agreedTerms}
            onChange={(e) => setAgreedTerms(e.target.checked)}
            label={
              <span className="small">
                I agree to the <span className="text-warning">Terms of Service</span> and <span className="text-warning">Privacy Policy</span>.
              </span>
            }
            className="auth-checkbox"
          />
        </Form.Group>

        {/* Submit Button */}
        <Button
          type="submit"
          className="login-btn w-100 mb-3 submit-action-btn"
          disabled={loading}
        >
          {loading ? (
            <span className="d-flex align-items-center justify-content-center gap-2">
              <Spinner animation="border" size="sm" />
              Creating Workspace...
            </span>
          ) : (
            "Create Free Account"
          )}
        </Button>

        {/* Bottom Switcher */}
        {setIsLogin && (
          <div className="text-center pt-2 border-top border-secondary border-opacity-25 mt-3">
            <span className="small">Already registered? </span>
            <button
              type="button"
              className="switch-form-link"
              onClick={() => setIsLogin(true)}
            >
              Sign In Instead
            </button>
          </div>
        )}
      </Form>

      {/* Security Guarantee Footer */}
      <div className="auth-security-footer mt-4 text-center">
        <span className="security-icon-tag">
          <FaShieldAlt className="me-1 text-success" /> Free Access · No Credit Card Required
        </span>
      </div>
    </div>
  );
};

export default RegisterForm;