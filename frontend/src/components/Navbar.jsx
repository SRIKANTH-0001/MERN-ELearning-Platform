import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./Notifications/NotificationBell";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <h3 style={styles.logo}>MERN E-Learning</h3>

      <div style={styles.navLinks}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/courses" style={styles.link}>Courses</Link>
        {isAuthenticated && user?.role === "student" && (
          <Link to="/student" style={styles.link}>Dashboard</Link>
        )}

        {isAuthenticated ? (
          <div style={styles.authLinks}>
            <NotificationBell />
            <span style={styles.role}>{user?.name} ({user?.role})</span>
            <button onClick={handleLogout} style={styles.button}>
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" style={styles.link}>Login</Link>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 30px",
    background: "#0f172a",
    color: "#fff",
  },
  logo: { margin: 0 },
  navLinks: {
    display: "flex",
    alignItems: "center",
  },
  authLinks: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  link: {
    color: "#fff",
    marginRight: "20px",
    textDecoration: "none",
  },
  role: {
    fontSize: "14px",
    opacity: 0.8,
  },
  button: {
    padding: "6px 14px",
    background: "#ef4444",
    border: "none",
    color: "#fff",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default Navbar;
