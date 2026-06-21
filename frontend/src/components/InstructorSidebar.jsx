import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/instructor.css";

const InstructorSidebar = ({ isOpen, toggleSidebar }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className={`instructor-sidebar ${isOpen ? "open" : "closed"}`}>
            <div className="sidebar-header">
                <div className="sidebar-logo">{isOpen ? "Instructor Panel" : "IP"}</div>
                {isOpen && (
                    <button onClick={toggleSidebar} className="close-sidebar-btn">×</button>
                )}
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/instructor" end className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} title="Dashboard">
                    <span className="sidebar-icon">🏠</span>
                    {isOpen && <span className="link-text">Dashboard</span>}
                </NavLink>
                <NavLink to="/instructor/create-course" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} title="Create Course">
                    <span className="sidebar-icon">➕</span>
                    {isOpen && <span className="link-text">Create Course</span>}
                </NavLink>
                <NavLink to="/instructor/upload-content" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} title="Upload Content">
                    <span className="sidebar-icon">📤</span>
                    {isOpen && <span className="link-text">Upload Content</span>}
                </NavLink>
                <NavLink to="/instructor/create-quiz" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} title="Create Quiz">
                    <span className="sidebar-icon">📝</span>
                    {isOpen && <span className="link-text">Create Quiz</span>}
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

export default InstructorSidebar;
