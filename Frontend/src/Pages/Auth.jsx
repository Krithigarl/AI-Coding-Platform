import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import { Navigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import WelcomePanel from "../components/WelcomePanel";

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (token) {
        return <Navigate to={role === "admin" ? "/admin" : "/dashboard"} replace />;
    }

    return (
        <Container fluid className="auth-page">
            <Row className="justify-content-center align-items-center vh-100">
                <Col lg={10}>
                    <div className="auth-card">
                        <Row className="g-0">
                            <Col lg={5}>
                                <WelcomePanel isLogin={isLogin} setIsLogin={setIsLogin} />
                            </Col>
                            <Col lg={7} className="d-flex align-items-center">
                                <motion.div
                                    key={isLogin ? "login" : "register"}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.35 }}
                                    className="w-100"
                                >
                                    {isLogin ? (
                                        <LoginForm setIsLogin={setIsLogin} />
                                    ) : (
                                        <RegisterForm setIsLogin={setIsLogin} />
                                    )}
                                </motion.div>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default Auth;