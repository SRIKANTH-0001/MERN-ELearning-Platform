import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentLayout from "../../components/StudentLayout";
import { getMyEnrolledCourses } from "../../api/courseApi";
import CourseCard from "../../components/CourseCard";
import { toast } from "react-toastify";

const EnrolledCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await getMyEnrolledCourses();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
        toast.error("Failed to load your courses.");
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const handleStartLearning = (courseId) => {
    navigate(`/student/course-player/${courseId}`);
  };

  if (loading) return (
    <StudentLayout>
      <div className="loading">Fetching your learning journey...</div>
    </StudentLayout>
  );

  return (
    <StudentLayout>
      <div className="student-header" style={{ paddingLeft: '0', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '800', background: 'linear-gradient(to right, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          My Enrolled Courses
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '18px' }}>Continue where you left off and master new skills.</p>
      </div>

      <div className="courses-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
        {courses.length > 0 ? (
          courses.map((course) => (
            <CourseCard
              key={course._id}
              course={{ ...course, isEnrolled: true }}
              onEnroll={handleStartLearning}
            />
          ))
        ) : (
          <div className="glass-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px' }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>📚</div>
            <h3 style={{ fontSize: '24px', marginBottom: '10px' }}>Your bookshelf is empty!</h3>
            <p style={{ color: '#94a3b8', fontSize: '16px', marginBottom: '30px' }}>Start your journey by enrolling in our world-class courses.</p>
            <button
              className="action-btn"
              onClick={() => navigate("/courses")}
              style={{ background: 'linear-gradient(90deg, #3b82f6, #2563eb)', border: 'none', padding: '15px 40px', borderRadius: '12px', fontWeight: 'bold' }}
            >
              Explore Courses
            </button>
          </div>
        )}
      </div>
    </StudentLayout>
  );
};

export default EnrolledCourses;
