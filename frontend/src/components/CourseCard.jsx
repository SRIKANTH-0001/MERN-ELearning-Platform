import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/student.css";

const CourseCard = ({ course, onEnroll }) => {
  const navigate = useNavigate();
  const defaultThumb = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop";

  return (
    <div
      className="glass-card course-card"
      style={{ padding: '0', display: 'flex', flexDirection: 'column', minHeight: '450px', cursor: 'pointer' }}
      onClick={() => navigate(`/student/course-player/${course._id}`)}
    >
      <div className="course-thumbnail" style={{ height: '200px', position: 'relative' }}>
        <img src={course.thumbnail || defaultThumb} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(15, 23, 42, 0.8)', padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.1)' }}>
          {course.level || "Expert"}
        </div>
      </div>

      <div className="course-content" style={{ padding: '25px', flex: '1', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px', color: '#f8fafc' }}>{course.title}</h3>
        <p className="course-description" style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.5', marginBottom: '20px', flex: '1' }}>
          {course.description || "Master this course with hands-on projects and expert guidance."}
        </p>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#cbd5e1', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <span>Progress</span>
            <span style={{ color: '#60a5fa' }}>45%</span>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ width: '45%', height: '100%', background: 'linear-gradient(90deg, #3b82f6, #a855f7)', borderRadius: '10px' }}></div>
          </div>
        </div>

        <div className="course-footer" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', gap: '15px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>⏱️ {course.duration || "12h"}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>👨‍🏫 {(course.instructor && typeof course.instructor === 'object') ? course.instructor.name : (course.instructor || "Expert")}</span>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!course?._id) {
              console.error("Course ID missing for navigation");
              return;
            }
            onEnroll(course._id);
          }}
          className="action-btn enroll-btn"
          style={{ width: '100%', marginTop: '20px', background: 'linear-gradient(90deg, #3b82f6, #2563eb)', border: 'none', borderRadius: '12px', padding: '12px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s ease' }}
        >
          {course.isEnrolled ? "Continue Learning" : "Enroll Now"}
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
