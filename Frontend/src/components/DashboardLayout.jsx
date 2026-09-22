import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBook,
  FaRoad,
  FaLaptopCode,
  FaCode,
  FaClipboardList,
  FaRobot,
  FaChartLine,
  FaLightbulb,
  FaCog,
  FaSignOutAlt,
  FaSearch,
  FaBell,
  FaQuestionCircle
} from "react-icons/fa";
import userAvatar from "../assets/user4.jpg";

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [userName, setUserName] = useState("Krithiga");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        setUserName(JSON.parse(stored));
      }
    } catch {
      // fallback
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: <FaHome /> },
    { path: "/dashboard/courses", label: "My Courses", icon: <FaBook /> },
    { path: "/dashboard/roadmap", label: "Roadmap", icon: <FaRoad /> },
    { path: "/dashboard/learning", label: "Learning", icon: <FaLaptopCode /> },
    { path: "/dashboard/practice", label: "Practice", icon: <FaCode /> },
    { path: "/dashboard/quizzes", label: "Quizzes", icon: <FaClipboardList /> },
    { path: "/dashboard/mentor", label: "AI Mentor", icon: <FaRobot /> },
    { path: "/dashboard/progress", label: "Progress", icon: <FaChartLine /> },
    { path: "/dashboard/achievements", label: "Achievements", icon: <FaLightbulb /> }
  ];

  const isCurrentActive = (path) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="dashboard-container">
      {/* Left Sidebar */}
      <aside className="dashboard-sidebar">
        {/* Brand Logo */}
        <div className="sidebar-logo">
          <span className="brand-symbol">🟠</span>
          <span className="brand-name">CodeGenius</span>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-menu">
          {navItems.map((item) => {
            const active = isCurrentActive(item.path);
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`sidebar-item ${active ? "active" : ""}`}
              >
                <span className="sidebar-item-icon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Menu */}
        <div className="sidebar-bottom">
          <Link
            to="/dashboard/profile"
            className={`sidebar-item ${location.pathname === "/dashboard/profile" ? "active" : ""}`}
          >
            <span className="sidebar-item-icon"><FaCog /></span>
            <span>Settings</span>
          </Link>
          <Link
            to="/dashboard/help"
            className={`sidebar-item ${location.pathname === "/dashboard/help" ? "active" : ""}`}
          >
            <span className="sidebar-item-icon"><FaQuestionCircle /></span>
            <span>Help & Support</span>
          </Link>

          {/* User profile badge matching screenshot */}
          <div className="sidebar-user-card" onClick={() => navigate("/dashboard/profile")}>
            <img src={userAvatar} alt="Krithiga R." className="sidebar-user-avatar" />
            <div className="sidebar-user-details">
              <span className="sidebar-user-name">Krithiga R.</span>
              <span className="sidebar-user-role">Student</span>
            </div>
          </div>

          <button className="sidebar-item logout-btn-item" onClick={handleLogout}>
            <span className="sidebar-item-icon"><FaSignOutAlt /></span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Dashboard Panel */}
      <main className="dashboard-main">
        {/* Top Navbar */}
        <header className="dashboard-top-navbar">
          <div className="top-search-wrapper">
            <FaSearch className="top-search-icon" />
            <input
              type="text"
              className="top-search-input form-control"
              placeholder="Search for courses, topics, code..."
            />
          </div>

          <div className="top-nav-actions">
            <button className="top-nav-icon-btn" title="Notifications">
              <FaBell />
            </button>
            <button className="top-nav-icon-btn" title="Alerts">
              <FaBell />
            </button>
            <img
              src={userAvatar}
              alt={userName}
              className="top-avatar-img"
              title={`Logged in as ${userName}`}
              onClick={() => navigate("/dashboard/profile")}
            />
          </div>
        </header>

        {/* Dynamic Nested Content */}
        <div className="dashboard-content-body">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;