import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getContentByCourse } from "../../api/contentApi";
import { getCourseById } from "../../api/courseApi";
import { toast } from "react-toastify";
import "../../styles/coursePlayer.css";

const CoursePlayer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [course, setCourse] = useState(null);
  const [contents, setContents] = useState([]);
  const [activeContent, setActiveContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!courseId) {
          toast.error("No course selected.");
          navigate("/student/courses");
          return;
        }

        const [contentData, courseData] = await Promise.all([
          getContentByCourse(courseId),
          getCourseById(courseId)
        ]);

        setContents(contentData);
        setCourse(courseData);

        if (contentData.length > 0) {
          setActiveContent(contentData[0]);
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
        toast.error("Failed to load course details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, navigate]);

  const platformLinks = [
    {
      name: "Guvi",
      url: `https://www.guvi.in/search?q=${encodeURIComponent(course?.title || "")}`,
      icon: "🌐",
      color: "#10b981"
    },
    {
      name: "Great Learning",
      url: `https://www.mygreatlearning.com/academy/search?q=${encodeURIComponent(course?.title || "")}`,
      icon: "🎓",
      color: "#3b82f6"
    },
    {
      name: "Edureka",
      url: `https://www.edureka.co/search/${encodeURIComponent(course?.title || "").replace(/%20/g, "+")}`,
      icon: "🚀",
      color: "#ef4444"
    }
  ];

  const getEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = url.split("v=")[1]?.split("&")[0] || url.split("/").pop();
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  if (loading) return <div className="loading" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)', color: '#fff', fontSize: '18px' }}>Initializing your classroom...</div>;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)', padding: '20px' }}>
      {/* Top Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px', maxWidth: '1600px', margin: '0 auto 20px auto' }}>
        <button
          onClick={() => navigate('/student')}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
         ← Back
        </button>

        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', background: 'linear-gradient(to right, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '0' }}>
            {course?.title || "Learning Lab"}
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: '5px 0 0 0' }}>{activeContent?.title || "Welcome to your learning journey"}</p>
        </div>

        <button
          onClick={() => navigate(`/student/quiz`, { state: { courseId } })}
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            border: 'none',
            color: '#fff',
            padding: '10px 24px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '700'
          }}
        >
          🏁 Finish & Quiz
        </button>
      </div>

      <div className="course-player-container" style={{ maxWidth: '1600px', margin: '0 auto' }}>
        <div className="video-section">
          <div className="video-container glass-card" style={{ padding: '0', borderRadius: '24px', overflow: 'hidden' }}>
            {activeContent ? (
              <iframe
                src={getEmbedUrl(activeContent.resourceUrl)}
                title={activeContent.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ width: '100%', height: '100%', border: 'none' }}
              ></iframe>
            ) : (
              <div className="video-placeholder" style={{ background: '#0f172a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <span style={{ fontSize: '64px', marginBottom: '20px' }}>📺</span>
                <p style={{ color: '#64748b' }}>Select a lesson to begin your mastery</p>
              </div>
            )}
          </div>

          <div className="glass-card content-info" style={{ marginTop: '20px', background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '25px', borderRadius: '16px' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '20px', color: '#f8fafc' }}>About this Session</h3>
            <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.8', margin: 0 }}>
              {activeContent?.description || `Master the fundamentals of ${course?.title}. Follow along and practice the core principles taught in this module.`}
            </p>
          </div>
        </div>

        <div className="side-sections" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="playlist-section glass-card" style={{ padding: '20px', maxHeight: '450px', display: 'flex', flexDirection: 'column' }}>
            <div className="playlist-header" style={{ marginBottom: '15px' }}>
              <h3 style={{ fontSize: '18px', margin: '0' }}>Course Content</h3>
              <span style={{ fontSize: '12px', color: '#64748b' }}>{contents.length} Units</span>
            </div>

            <div className="playlist-items" style={{ overflowY: 'auto', flex: 1 }}>
              {contents.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>No curriculum items found.</div>
              ) : (
                contents.map((item, index) => (
                  <div
                    key={item._id}
                    className={`playlist-item ${activeContent?._id === item._id ? "active" : ""}`}
                    onClick={() => setActiveContent(item)}
                    style={{
                      padding: '12px',
                      borderRadius: '12px',
                      background: activeContent?._id === item._id ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                      cursor: 'pointer',
                      marginBottom: '8px',
                      display: 'flex',
                      gap: '12px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold' }}>
                      {index + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: activeContent?._id === item._id ? '#60a5fa' : '#f8fafc' }}>{item.title}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{item.duration || "15 mins"}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="external-resources glass-card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>💎 Premium Resources</h3>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '15px' }}>Explore this topic on world-class industrial platforms:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {platformLinks.map((p, idx) => (
                <a
                  key={idx}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.03)',
                    textDecoration: 'none',
                    border: '1px solid rgba(255,255,255,0.05)',
                    transition: 'all 0.3s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                >
                  <span style={{ fontSize: '18px', color: p.color }}>{p.icon}</span>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#f8fafc' }}>{p.name} Official</div>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>Search curriculum on {p.name}</div>
                  </div>
                  <span style={{ marginLeft: 'auto', fontSize: '12px' }}>↗</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;
