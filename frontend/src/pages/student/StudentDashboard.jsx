import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import StudentLayout from "../../components/StudentLayout";
import { getStudentDashboardStats } from "../../api/studentApi";
import { getMyEnrolledCourses } from "../../api/courseApi";
import { toast } from "react-toastify";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [statsData, setStatsData] = useState({
    enrolledCourses: "0",
    quizAttempts: "0",
    certificatesEarned: "0",
    avgPerformance: "0%"
  });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [stats, enrolled] = await Promise.all([
          getStudentDashboardStats(),
          getMyEnrolledCourses()
        ]);
        setStatsData(stats);
        setCourses(enrolled.slice(0, 3)); // Show first 3 for selection preview
      } catch (err) {
        console.error("Dashboard Load Error:", err);
        toast.error("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const stats = [
    { label: "Enrolled Courses", value: statsData.enrolledCourses, icon: "📚", color: "#3b82f6" },
    { label: "Quizzes Attempted", value: statsData.quizAttempts, icon: "📝", color: "#8b5cf6" },
    { label: "Certificates Earned", value: statsData.certificatesEarned, icon: "🎓", color: "#10b981" },
    { label: "Avg. Performance", value: statsData.avgPerformance, icon: "⭐", color: "#f59e0b" },
  ];

  return (
    <StudentLayout>
      <div className="student-header" style={{ paddingLeft: '0', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '800', background: 'linear-gradient(to right, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Welcome Back, Future Developer!
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '18px' }}>Your learning journey is on fire. Keep it up!</p>
      </div>

      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {stats.map((stat, index) => (
          <div key={index} className="glass-card" style={{ padding: '20px', textAlign: 'center', borderLeft: `4px solid ${stat.color}` }}>
            <div style={{ fontSize: '30px', marginBottom: '10px' }}>{stat.icon}</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#f8fafc' }}>{stat.value}</div>
            <div style={{ fontSize: '14px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-main-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px' }}>
        <div className="quick-selection">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ fontSize: '22px' }}>🎯 My Active Learning</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <select
                onChange={(e) => {
                  if (!e.target.value) return;
                  navigate(`/student/course-player/${e.target.value}`, { state: { fromDashboard: true } });
                }}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  fontSize: '14px',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="">Quick Jump to Course...</option>
                {courses.map(course => (
                  <option key={course._id} value={course._id} style={{ background: '#0f172a' }}>{course.title}</option>
                ))}
              </select>
              <Link to="/student/courses" style={{ color: "#3b82f6", fontSize: "14px", textDecoration: "none" }}>View All →</Link>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {loading ? (
              <div style={{ color: "#94a3b8" }}>Fetching your courses...</div>
            ) : courses.length > 0 ? (
              courses.map(course => (
                <div key={course._id} className="glass-card" style={{ display: "flex", gap: "20px", padding: "15px", alignItems: "center", background: "rgba(30, 41, 59, 0.4)" }}>
                  <div style={{ width: "80px", height: "60px", background: `url(${course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=200'}) center/cover`, borderRadius: "8px" }}></div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: "0", fontSize: "16px", color: "#f8fafc" }}>{course.title}</h4>
                    <div style={{ width: "100%", height: "4px", background: "rgba(255,255,255,0.05)", borderRadius: "10px", marginTop: "8px", overflow: "hidden" }}>
                      <div style={{ width: "45%", height: "100%", background: "#60a5fa" }}></div>
                    </div>
                  </div>
                  <button
                    className="action-btn"
                    onClick={() => navigate(`/student/course-player/${course._id}`, { state: { fromDashboard: true } })}
                    style={{ padding: "8px 18px", fontSize: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    Continue Learning
                  </button>
                </div>
              ))
            ) : (
              <div className="glass-card" style={{ padding: "30px", textAlign: "center", border: "1px dashed rgba(255,255,255,0.1)" }}>
                <p style={{ color: "#94a3b8", marginBottom: "15px" }}>No active courses found.</p>
                <Link to="/courses" className="action-btn" style={{ textDecoration: "none", fontSize: "14px", display: "inline-block" }}>Browse Catalog</Link>
              </div>
            )}
          </div>
        </div>

        <div className="quick-actions">
          <h3 style={{ marginBottom: '20px', fontSize: '22px' }}>🚀 Jump Back In</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <Link to="/student/quiz" className="glass-card" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1510070112810-d4e9a46d9e91?q=80&w=600&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '160px' }}>
              <div style={{ position: 'absolute', inset: '0', background: 'rgba(88, 28, 135, 0.75)', padding: '25px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <h3 style={{ margin: '0 0 5px 0', fontSize: "18px" }}>📝 Take a Quiz</h3>
                <p style={{ margin: '0', fontSize: '13px', color: '#cbd5e1' }}>Prove what you've learned today.</p>
              </div>
            </Link>

            <Link to="/student/certificates" className="glass-card" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '160px' }}>
              <div style={{ position: 'absolute', inset: '0', background: 'rgba(5, 150, 105, 0.75)', padding: '25px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <h3 style={{ margin: '0 0 5px 0', fontSize: "18px" }}>🎓 Certificates</h3>
                <p style={{ margin: '0', fontSize: '13px', color: '#cbd5e1' }}>Manage your earned certifications.</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;
