import React from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <p>Manage users, courses, and platform settings.</p>
      </div>

      <div className="dashboard-grid">
        <Link to="/admin/users" className="glass-card users-card" data-card="users">
          <div className="card-overlay"></div>
          <div className="card-content">
            <h3>👥 Manage Users</h3>
            <p>View and manage all registered users, their roles, and permissions.</p>
          </div>
        </Link>

        <Link to="/admin/courses" className="glass-card courses-card" data-card="courses">
          <div className="card-overlay"></div>
          <div className="card-content">
            <h3>📚 Manage Courses</h3>
            <p>Oversee all courses, instructors, and course publications.</p>
          </div>
        </Link>

        <Link to="/admin/analytics" className="glass-card analytics-card" data-card="analytics">
          <div className="card-overlay"></div>
          <div className="card-content">
            <h3>📊 Analytics</h3>
            <p>View platform statistics, user engagement, and course performance.</p>
          </div>
        </Link>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
