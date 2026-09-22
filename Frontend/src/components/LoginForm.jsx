import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { FaEnvelope, FaLock } from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";
import { useLocation, useNavigate } from "react-router-dom";

const LoginForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const savedEmail = Cookies.get("rememberedEmail");
  const [loginData, setLoginData] = useState({
    email: savedEmail || "",
    password: ""
  });
  const rememberMe = Boolean(savedEmail);

 const updateForm = (e) => {
    const { name, value } = e.target;

    setLoginData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/login",
        loginData
      );

      alert(res.data.message);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user?.fullname || res.data.user?.name || "Krithiga"));
      localStorage.setItem("userId", JSON.stringify(res.data.user?.id || res.data.user?._id || "1"));

       // Remember Me Cookie
        if (rememberMe) {
          Cookies.set("rememberedEmail", loginData.email, {
            expires: 7 // save for 7 days
          });
        } else {
          Cookies.remove("rememberedEmail");
        }

      const redirectTo = location.state?.from || "/dashboard";
      navigate(redirectTo, { replace: true });
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  const handleDemoLogin = () => {
    localStorage.setItem("token", "demo-token-" + Date.now());
    localStorage.setItem("user", JSON.stringify("Krithiga"));
    localStorage.setItem("userId", JSON.stringify("demo-krithiga-123"));
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="form-section">

      <h2>Welcome Back</h2>

      <Form onSubmit={handleLogin}>

        <Form.Group className="mb-3">
          <Form.Label>
            <FaEnvelope />
            <span className="ps-3">Email</span>
          </Form.Label>

          <Form.Control
            type="email"
            name="email"
            value={loginData.email}
            onChange={updateForm}
            placeholder="Enter your email"
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>
            <FaLock />
            <span className="ps-3">Password</span>
          </Form.Label>

          <Form.Control
            type="password"
            name="password"
            value={loginData.password}
            onChange={updateForm}
            placeholder="Password"
          />
        </Form.Group>

        <Button type="submit" className="login-btn w-100 mb-3">
          Login
        </Button>

        <Button
          type="button"
          variant="outline-warning"
          className="w-100 rounded-pill"
          style={{ borderColor: "#ff7a00", color: "#ff7a00" }}
          onClick={handleDemoLogin}
        >
          ⚡ Quick Demo Login (as Krithiga)
        </Button>

      </Form>
    </div>
  );
};

export default LoginForm;