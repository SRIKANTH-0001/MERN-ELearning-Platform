import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getContentByCourse, markContentCompleted } from "../../api/contentApi";
import { getCourseById } from "../../api/courseApi";
import { getStudentProgress } from "../../api/progressApi";
import { toast } from "react-toastify";
import "../../styles/coursePlayer.css";

const CoursePlayer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [contents, setContents] = useState([]);
  const [activeContent, setActiveContent] = useState(null);
  const [courseProgress, setCourseProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completingContentId, setCompletingContentId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!courseId) {
          toast.error("No course selected.");
          navigate("/student/courses");
          return;
        }

        const [contentData, courseData, progressData] = await Promise.all([
          getContentByCourse(courseId),
          getCourseById(courseId),
          getStudentProgress()
        ]);

        const sortedContents = [...contentData].sort((a, b) => (a.order ?? 1) - (b.order ?? 1));
        setContents(sortedContents);
        setCourse(courseData);

        const matchedProgress = (progressData || []).find((item) =>
          item.course?._id === courseId || item.course === courseId
        );
        setCourseProgress(matchedProgress || null);

        if (sortedContents.length > 0) {
          setActiveContent((current) => {
            if (current && sortedContents.some((item) => item._id === current._id)) {
              return current;
            }
            return sortedContents[0];
          });
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

    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/)([\w-]{11})/);
    if (youtubeMatch) {
      return `https://www.youtube-nocookie.com/embed/${youtubeMatch[1]}?rel=0`;
    }

    return url;
  };

  if (loading) return <div className="loading" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)', color: '#fff', fontSize: '18px' }}>Initializing your classroom...</div>;

  const currentEmbedUrl = activeContent ? getEmbedUrl(activeContent.resourceUrl) : null;
  const isYouTubeVideo = Boolean(activeContent?.resourceUrl && /youtube\.com|youtu\.be/.test(activeContent.resourceUrl));
  const completedContentIds = new Set((courseProgress?.completedContents || []).map((item) => (typeof item === "string" ? item : item._id)));
  const videoContents = contents.filter((item) => item.type === "video");
  const allVideosCompleted = videoContents.length === 0 || videoContents.every((item) => completedContentIds.has(item._id));

  const handleSelectContent = async (item) => {
    setActiveContent(item);

    if (item.type !== "video" || !item._id || completedContentIds.has(item._id) || completingContentId) {
      return;
    }

    setCompletingContentId(item._id);
    try {
      await markContentCompleted(item._id);
      setCourseProgress((prev) =>
        prev
          ? { ...prev, completedContents: [...(prev.completedContents || []), item._id] }
          : { completedContents: [item._id] }
      );
    } catch (error) {
      console.error("Failed to mark content as completed:", error);
      toast.error("Unable to update your learning progress.");
    } finally {
      setCompletingContentId(null);
    }
  };

  const handleQuizClick = () => {
    if (!allVideosCompleted) {
      toast.info("Complete all tutorial videos before opening the assessment.");
      return;
    }

    navigate(`/student/quiz`, { state: { courseId } });
  };

  const openVideoInNewTab = () => {
    if (activeContent?.resourceUrl) {
      window.open(activeContent.resourceUrl, "_blank", "noopener,noreferrer");
    }
  };

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
          onClick={handleQuizClick}
          disabled={!allVideosCompleted}
          style={{
            background: allVideosCompleted ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'rgba(255,255,255,0.1)',
            border: 'none',
            color: '#fff',
            padding: '10px 24px',
            borderRadius: '12px',
            cursor: allVideosCompleted ? 'pointer' : 'not-allowed',
            fontSize: '14px',
            fontWeight: '700',
            opacity: allVideosCompleted ? 1 : 0.8
          }}
        >
          {allVideosCompleted ? '🏁 Finish & Quiz' : 'Watch tutorials'}
        </button>
      </div>

      <div className="course-player-container" style={{ maxWidth: '1600px', margin: '0 auto' }}>
        <div className="video-section">
          <div className="video-container glass-card" style={{ padding: '0', borderRadius: '24px', overflow: 'hidden' }}>
            {currentEmbedUrl ? (
              <iframe
                src={currentEmbedUrl}
                title={activeContent?.title || "Course video"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                style={{ width: '100%', height: '100%', border: 'none' }}
              ></iframe>
            ) : (
              <div className="video-placeholder" style={{ background: '#0f172a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <span style={{ fontSize: '64px', marginBottom: '20px' }}>📺</span>
                <p style={{ color: '#64748b' }}>Select a lesson to begin your mastery</p>
              </div>
            )}
          </div>

          {isYouTubeVideo && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px', position: 'relative', zIndex: 10 }}>
              <button
                type="button"
                onClick={openVideoInNewTab}
                style={{
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  border: 'none',
                  color: '#fff',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '700',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
                }}
              >
                ▶ Open on YouTube
              </button>
            </div>
          )}

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
                  <button
                    key={item._id || index}
                    type="button"
                    className={`playlist-item ${activeContent?._id === item._id ? "active" : ""}`}
                    onClick={() => handleSelectContent(item)}
                    style={{
                      padding: '12px',
                      borderRadius: '12px',
                      background: activeContent?._id === item._id ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                      cursor: 'pointer',
                      marginBottom: '8px',
                      display: 'flex',
                      gap: '12px',
                      transition: 'all 0.2s',
                      width: '100%',
                      textAlign: 'left',
                      border: 'none',
                      color: 'inherit',
                      font: 'inherit'
                    }}
                  >
                    <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold' }}>
                      {index + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: activeContent?._id === item._id ? '#60a5fa' : '#f8fafc' }}>{item.title}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{item.duration || "15 mins"}</div>
                      {item.type === "video" && completedContentIds.has(item._id) && (
                        <div style={{ fontSize: '10px', color: '#10b981', marginTop: '4px' }}>✓ completed</div>
                      )}
                    </div>
                  </button>
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
                    transition: 'all 0.3s',
                    cursor: 'pointer',
                    position: 'relative',
                    zIndex: 2,
                    pointerEvents: 'auto'
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
