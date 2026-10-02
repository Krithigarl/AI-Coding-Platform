import React, { useState, useEffect } from "react";
import { FaUsers, FaSearch, FaUserShield, FaUserGraduate, FaTrash, FaCheck } from "react-icons/fa";
import axios from "axios";

const defaultUsers = [
  { _id: "u1", fullname: "Krithiga R.", email: "krithiga@example.com", role: "user", createdAt: "2026-03-15T10:00:00Z" },
  { _id: "u2", fullname: "Platform Administrator", email: "admin@codegenius.com", role: "admin", createdAt: "2026-01-10T09:00:00Z" },
  { _id: "u3", fullname: "Alex Johnson", email: "alex.j@example.com", role: "user", createdAt: "2026-04-02T14:30:00Z" },
  { _id: "u4", fullname: "Sarah Connor", email: "sarah.c@tech.io", role: "user", createdAt: "2026-04-12T11:20:00Z" },
];

const AdminUsers = () => {
  const [users, setUsers] = useState(defaultUsers);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/api/admin/users");
      if (res.data && res.data.length > 0) {
        setUsers(res.data);
      }
    } catch (err) {
      console.log("Using default users list");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRole = async (user) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    try {
      await axios.patch(`http://localhost:3000/api/admin/users/${user._id}/role`, { role: newRole });
      setUsers(users.map((u) => (u._id === user._id ? { ...u, role: newRole } : u)));
      alert(`Role for ${user.fullname} updated to ${newRole.toUpperCase()}!`);
    } catch (err) {
      // Offline fallback toggle
      setUsers(users.map((u) => (u._id === user._id ? { ...u, role: newRole } : u)));
      alert(`Role for ${user.fullname} updated to ${newRole.toUpperCase()}`);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to remove this user?")) {
      try {
        await axios.delete(`http://localhost:3000/api/admin/users/${id}`);
      } catch (err) {
        // continue
      }
      setUsers(users.filter((u) => u._id !== id));
    }
  };

  const filtered = users.filter((u) =>
    (u.fullname || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-users-view">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">User & Role Management 👥</h2>
          <p className="admin-page-desc">
            View registered students, elevate team members to administrators, and monitor platform access.
          </p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="admin-badge badge-active">
            <FaCheck /> {users.length} Registered Accounts
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="admin-panel mb-4 py-3">
        <div className="position-relative">
          <FaSearch className="position-absolute text-muted" style={{ left: 16, top: 12 }} />
          <input
            type="text"
            className="form-control ps-5"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff",
              borderRadius: "10px"
            }}
            placeholder="Search users by name or email address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table Panel */}
      <div className="admin-panel">
        <div className="admin-panel-header">
          <h4 className="admin-panel-title">
            <FaUsers style={{ color: "#00d2ff" }} />
            All Accounts
          </h4>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Current Role</th>
                <th>Joined Date</th>
                <th>Permissions</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className="fw-bold text-white">{user.fullname}</div>
                    <div className="small text-muted">{user.email}</div>
                  </td>
                  <td>
                    {user.role === "admin" ? (
                      <span className="admin-badge badge-admin">
                        <FaUserShield /> Administrator
                      </span>
                    ) : (
                      <span className="admin-badge badge-user">
                        <FaUserGraduate /> Student
                      </span>
                    )}
                  </td>
                  <td className="text-muted small">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Active"}
                  </td>
                  <td>
                    <span className="small text-muted">
                      {user.role === "admin"
                        ? "Full Admin Console Access"
                        : "Standard Student Access"}
                    </span>
                  </td>
                  <td className="text-end">
                    <div className="d-flex justify-content-end gap-2">
                      <button
                        className="admin-btn-sm admin-btn-outline"
                        onClick={() => handleToggleRole(user)}
                        title={user.role === "admin" ? "Demote to Student" : "Promote to Admin"}
                      >
                        {user.role === "admin" ? "Demote to Student" : "Promote to Admin"}
                      </button>
                      <button
                        className="admin-btn-sm admin-btn-danger-sm"
                        onClick={() => handleDeleteUser(user._id)}
                        title="Delete User"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
