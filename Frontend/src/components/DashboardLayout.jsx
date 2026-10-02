import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
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
  FaQuestionCircle,
  FaBars,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import userAvatar from "../assets/user4.jpg";

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [userName, setUserName] = useState("Student");
  const [userRole, setUserRole] = useState("Student");

  // Sidebar starts with icons only
  const [isCollapsed, setIsCollapsed] = useState(true);

  useEffect(() => {
    // 1. Initial read from localStorage
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const user = JSON.parse(stored);
        if (user && typeof user === "object") {
          setUserName(user.fullname || user.name || "Student");
          setUserRole(user.role === "admin" ? "Admin" : "Student");
        } else if (typeof user === "string") {
          setUserName(user);
        }
      }
    } catch {}

    // 2. Fetch live profile details from backend
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/auth/me");
        if (res.data && res.data.user) {
          const u = res.data.user;
          setUserName(u.fullname || "Student");
          setUserRole(u.role === "admin" ? "Admin" : "Student");
          localStorage.setItem("user", JSON.stringify(u));
          localStorage.setItem("userRole", u.role);
          localStorage.setItem("userId", JSON.stringify(u.id || u._id));
        }
      } catch (err) {
        // Fallback to local stored info
      }
    };

    if (localStorage.getItem("token")) {
      fetchUserProfile();
    }
  }, []);


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
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
    { path: "/dashboard/achievements", label: "Achievements", icon: <FaLightbulb /> },
  ];

  const isCurrentActive = (path) => {
    if (path === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(path);
  };

  const handleItemClick = (path) => {
    if (isCollapsed) {
      setIsCollapsed(false);
    }
    navigate(path);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${isCollapsed ? "collapsed" : ""}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div
            className="sidebar-logo-brand"
            onClick={() => handleItemClick("/dashboard")}
          >
            <span className="brand-symbol">🟠</span>
            {!isCollapsed && <span className="brand-name">CodeGenius</span>}
          </div>

          <button
            className="sidebar-collapse-toggle-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        </div>

        {/* Menu */}
        <nav className="sidebar-menu">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleItemClick(item.path)}
              className={`sidebar-item ${
                isCurrentActive(item.path) ? "active" : ""
              }`}
              title={item.label}
            >
              <span className="sidebar-item-icon">{item.icon}</span>

              {!isCollapsed && (
                <span className="sidebar-item-label">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="sidebar-bottom">
          <button
            onClick={() => handleItemClick("/dashboard/profile")}
            className={`sidebar-item ${
              location.pathname === "/dashboard/profile" ? "active" : ""
            }`}
          >
            <span className="sidebar-item-icon">
              <FaCog />
            </span>

            {!isCollapsed && (
              <span className="sidebar-item-label">Settings</span>
            )}
          </button>

          <button
            onClick={() => handleItemClick("/dashboard/help")}
            className={`sidebar-item ${
              location.pathname === "/dashboard/help" ? "active" : ""
            }`}
          >
            <span className="sidebar-item-icon">
              <FaQuestionCircle />
            </span>

            {!isCollapsed && (
              <span className="sidebar-item-label">Help & Support</span>
            )}
          </button>

          <div
            className="sidebar-user-card"
            onClick={() => handleItemClick("/dashboard/profile")}
          >
            <img src={userAvatar} alt="user" className="sidebar-user-avatar" />

            {!isCollapsed && (
              <div className="sidebar-user-details">
                <span className="sidebar-user-name">{userName}</span>
                <span className="sidebar-user-role">{userRole}</span>
              </div>
            )}
          </div>

          <button className="sidebar-item logout-btn-item" onClick={handleLogout}>
            <span className="sidebar-item-icon">
              <FaSignOutAlt />
            </span>

            {!isCollapsed && (
              <span className="sidebar-item-label">Logout</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="dashboard-main">
        <header className="dashboard-top-navbar">
          <div className="top-nav-left">
            <button
              className="top-sidebar-toggle-btn"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <FaBars />
            </button>

            <div className="top-search-wrapper">
              <FaSearch className="top-search-icon" />

              <input
                type="text"
                placeholder="Search for courses..."
                className="top-search-input"
              />
            </div>
          </div>

          <div className="top-nav-actions">
            <button className="top-nav-icon-btn">
              <FaBell />
            </button>

            <img
              src={userAvatar}
              alt={userName}
              className="top-avatar-img"
              onClick={() => navigate("/dashboard/profile")}
            />
          </div>
        </header>

        <div className="dashboard-content-body">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;