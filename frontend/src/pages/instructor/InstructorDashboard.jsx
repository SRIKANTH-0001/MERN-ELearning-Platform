import React from "react";
import { Link } from "react-router-dom";
import InstructorLayout from "../../components/InstructorLayout";

const InstructorDashboard = () => {
  return (
    <InstructorLayout>
      <div className="instructor-header">
        <h2>Instructor Dashboard</h2>
        <p>Manage courses, content, and quizzes from your control panel.</p>
      </div>

      <div className="dashboard-grid">
        <Link to="/instructor/create-course" className="glass-card create-course-card">
          <div className="card-overlay"></div>
          <div className="card-content">
            <h3>➕ Create Course</h3>
            <p>Design and publish a new course for students to enroll in.</p>
          </div>
        </Link>

        <Link to="/instructor/upload-content" className="glass-card upload-content-card">
          <div className="card-overlay"></div>
          <div className="card-content">
            <h3>📤 Upload Content</h3>
            <p>Add videos, PDFs, or external links to your courses.</p>
          </div>
        </Link>

        <Link to="/instructor/create-quiz" className="glass-card create-quiz-card">
          <div className="card-overlay"></div>
          <div className="card-content">
            <h3>📝 Create Quiz</h3>
            <p>Design quizzes to assess student understanding.</p>
          </div>
        </Link>
      </div>
    </InstructorLayout>
  );
};

export default InstructorDashboard;
