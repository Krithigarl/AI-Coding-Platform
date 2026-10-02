import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FaChartPie,
  FaBook,
  FaUsers,
  FaClipboardList,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
  FaExternalLinkAlt,
  FaBell,
  FaShieldAlt,
  FaTerminal,
  FaBars,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";
import "./Admin.css";
import userAvatar from "../../assets/user4.jpg";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [adminName, setAdminName] = useState("Administrator");
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object") {
          setAdminName(parsed.fullname || parsed.name || "Administrator");
        } else if (typeof parsed === "string") {
          setAdminName(parsed);
        }
      }
    } catch {
      // fallback
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
    { path: "/admin/dashboard", label: "Dashboard", icon: <FaChartPie /> },
    { path: "/admin/courses", label: "Manage Courses", icon: <FaBook /> },
    { path: "/admin/users", label: "Users & Roles", icon: <FaUsers /> },
    { path: "/admin/registrations", label: "Registrations", icon: <FaClipboardList /> },
    { path: "/admin/analytics", label: "Platform Analytics", icon: <FaChartLine /> },
    { path: "/admin/settings", label: "System Settings", icon: <FaCog /> },
  ];

  const isCurrentActive = (path) => {
    if (path === "/admin/dashboard" || path === "/admin") {
      return location.pathname === "/admin" || location.pathname === "/admin/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  const handleItemClick = (path) => {
    if (isCollapsed) {
      setIsCollapsed(false);
    }
    navigate(path);
  };

  return (
    <div className="admin-container">
      {/* Admin Sidebar */}
      <aside className={`admin-sidebar ${isCollapsed ? "collapsed" : ""}`}>
        {/* Brand Header */}
        <div className="admin-brand">
          <div
            className="d-flex align-items-center gap-3 overflow-hidden"
            onClick={() => handleItemClick("/admin")}
            style={{ cursor: "pointer" }}
            title="CodeGenius Admin Console"
          >
            <div className="admin-brand-icon">
              <FaShieldAlt />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="admin-brand-title">CodeGenius</h1>
                <span className="admin-badge-pill">Admin Console</span>
              </div>
            )}
          </div>
          <button
            type="button"
            className="sidebar-collapse-toggle-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label="Toggle Sidebar"
          >
            {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        </div>

        {/* Menu Section */}
        {!isCollapsed && <div className="admin-menu-section-title">Navigation</div>}
        <nav className="admin-menu">
          {navItems.map((item) => {
            const active = isCurrentActive(item.path);
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => handleItemClick(item.path)}
                className={`admin-nav-item ${active ? "active" : ""}`}
                title={isCollapsed ? `${item.label} (Click to expand and view)` : item.label}
              >
                <span className="admin-nav-icon">{item.icon}</span>
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="admin-sidebar-footer">
          {/* Quick link to switch to Student Dashboard */}
          <Link
            to="/dashboard"
            className="admin-switch-btn"
            title="Preview Student Dashboard"
          >
            <FaExternalLinkAlt />
            {!isCollapsed && <span>Switch to Student View</span>}
          </Link>

          {/* Admin user info */}
          <div
            className="admin-user-profile"
            onClick={() => handleItemClick("/admin/settings")}
            title={isCollapsed ? `${adminName} (Super Admin)` : "Admin Profile"}
          >
            <img src={userAvatar} alt={adminName} className="admin-user-avatar" />
            {!isCollapsed && (
              <div className="admin-user-meta">
                <span className="admin-user-name">{adminName}</span>
                <span className="admin-user-role-badge">Super Admin</span>
              </div>
            )}
          </div>

          {/* Logout button */}
          <button
            type="button"
            className="admin-logout-btn"
            onClick={handleLogout}
            title="Sign Out"
          >
            <FaSignOutAlt />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Admin Surface */}
      <main className="admin-main">
        {/* Top Header */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              type="button"
              className="top-sidebar-toggle-btn me-2"
              onClick={() => setIsCollapsed(!isCollapsed)}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar to icons only"}
              aria-label="Toggle Sidebar"
            >
              <FaBars />
            </button>
            <div className="admin-live-badge">
              <span className="admin-pulse-dot"></span>
              <span>Platform Live & Healthy</span>
            </div>
          </div>

          <div className="admin-topbar-right">
            <button
              className="admin-top-action-btn"
              title="API Console"
              onClick={() => navigate("/admin/settings")}
            >
              <FaTerminal />
            </button>
            <button
              className="admin-top-action-btn"
              title="System Alerts"
              onClick={() => alert("All system services running normally. 0 critical alerts.")}
            >
              <FaBell />
              <span className="admin-badge-dot"></span>
            </button>
            <Link
              to="/dashboard"
              className="btn btn-sm btn-outline-warning text-nowrap rounded-pill px-3 py-1"
              style={{ fontSize: "12px", borderColor: "#ff7a00", color: "#ff7a00" }}
            >
              Student Portal →
            </Link>
          </div>
        </header>

        {/* Render child pages */}
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
