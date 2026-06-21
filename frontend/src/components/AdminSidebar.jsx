import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/admin.css";

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className={`admin-sidebar ${isOpen ? "open" : "closed"}`}>
            <div className="sidebar-header">
                <div className="sidebar-logo">{isOpen ? "Admin Panel" : "AP"}</div>
                {isOpen && (
                    <button onClick={toggleSidebar} className="close-sidebar-btn">×</button>
                )}
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/admin" end className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} title="Dashboard">
                    <span className="sidebar-icon">🏠</span>
                    {isOpen && <span className="link-text">Dashboard</span>}
                </NavLink>
                <NavLink to="/admin/users" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} title="Manage Users">
                    <span className="sidebar-icon">👥</span>
                    {isOpen && <span className="link-text">Manage Users</span>}
                </NavLink>
                <NavLink to="/admin/courses" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} title="Manage Courses">
                    <span className="sidebar-icon">📚</span>
                    {isOpen && <span className="link-text">Manage Courses</span>}
                </NavLink>
                <NavLink to="/admin/analytics" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} title="Analytics">
                    <span className="sidebar-icon">📊</span>
                    {isOpen && <span className="link-text">Analytics</span>}
                </NavLink>
            </nav>

            <div className="sidebar-footer">
                <button onClick={handleLogout} className="sidebar-link logout-btn" title="Logout">
                    <span className="sidebar-icon">🚪</span>
                    {isOpen && <span className="link-text">Logout</span>}
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;
