import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { FaEnvelope, FaLock } from "react-icons/fa";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  const updateData = (e) => {
    const { name, value } = e.target;

    setRegisterData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/register",
        registerData
      );

      alert(res.data.message);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user?.fullname || registerData.fullname || "Krithiga"));
      if (res.data.user?.id) {
        localStorage.setItem("userId", JSON.stringify(res.data.user.id));
      }
      const redirectTo = location.state?.from || "/dashboard";
      navigate(redirectTo, { replace: true });

      setRegisterData({
        fullname: "",
        email: "",
        password: "",
      });
    } catch (error) {
      alert(error.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="form-section">
      <h2>Create Account</h2>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>
            <FaEnvelope />
            <span className="ps-3">Full Name</span>
          </Form.Label>

          <Form.Control
            type="text"
            name="fullname"
            value={registerData.fullname}
            onChange={updateData}
            placeholder="Enter your full name"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>
            <FaEnvelope />
            <span className="ps-3">Email</span>
          </Form.Label>

          <Form.Control
            type="email"
            name="email"
            value={registerData.email}
            onChange={updateData}
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
            value={registerData.password}
            onChange={updateData}
            placeholder="Password"
          />
        </Form.Group>

        <Button className="w-100 login-btn" type="submit">
          Register
        </Button>
      </Form>
    </div>
  );
};

export default RegisterForm;