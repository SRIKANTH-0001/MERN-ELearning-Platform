import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/student.css";

const StudentSidebar = ({ isOpen, toggleSidebar }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className={`student-sidebar ${isOpen ? "open" : "closed"}`}>
            <div className="sidebar-header">
                <div className="sidebar-logo">{isOpen ? "MERN Learning" : "ML"}</div>
                {isOpen && (
                    <button onClick={toggleSidebar} className="close-sidebar-btn">×</button>
                )}
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/student" end className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} title="Dashboard">
                    <span className="sidebar-icon">🏠</span>
                    {isOpen && <span className="link-text">Dashboard</span>}
                </NavLink>
                <NavLink to="/student/courses" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} title="My Courses">
                    <span className="sidebar-icon">📚</span>
                    {isOpen && <span className="link-text">My Courses</span>}
                </NavLink>
                <NavLink to="/courses" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} title="Explore Courses">
                    <span className="sidebar-icon">🌎</span>
                    {isOpen && <span className="link-text">Explore Courses</span>}
                </NavLink>
                <NavLink to="/student/quiz" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} title="Attempt Quiz">
                    <span className="sidebar-icon">📝</span>
                    {isOpen && <span className="link-text">Attempt Quiz</span>}
                </NavLink>
                <NavLink to="/student/progress" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} title="Progress">
                    <span className="sidebar-icon">📈</span>
                    {isOpen && <span className="link-text">Progress</span>}
                </NavLink>
                <NavLink to="/student/certificates" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} title="Certificates">
                    <span className="sidebar-icon">🎓</span>
                    {isOpen && <span className="link-text">Certificates</span>}
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

export default StudentSidebar;
