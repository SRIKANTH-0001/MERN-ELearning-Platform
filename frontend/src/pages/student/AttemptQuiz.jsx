import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StudentLayout from "../../components/StudentLayout";
import Lottie from "lottie-react";
import { submitQuiz, getQuizByCourse } from "../../api/quizApi";
import { getMyEnrolledCourses } from "../../api/courseApi";

const AttemptQuiz = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { courseId: stateCourseId } = location.state || {};

  const [courseId, setCourseId] = useState(stateCourseId || "");
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [animations, setAnimations] = useState({ success: null, sad: null });

  useEffect(() => {
    // Fetch animations
    fetch("https://assets9.lottiefiles.com/packages/lf20_pqnfmone.json")
      .then(res => res.json())
      .then(data => setAnimations(prev => ({ ...prev, success: data })));

    fetch("https://assets1.lottiefiles.com/packages/lf20_0p96p5u6.json")
      .then(res => res.json())
      .then(data => setAnimations(prev => ({ ...prev, sad: data })));
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        if (!courseId) {
          // If no courseId, fetch enrolled courses
          const courses = await getMyEnrolledCourses();
          setEnrolledCourses(courses);
          setLoading(false);
        } else {
          // If courseId exists, fetch quiz directly
          await fetchQuizData(courseId);
        }
      } catch (err) {
        console.error("Error loading initial data:", err);
        setError("Failed to load your courses. Please try again.");
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [courseId]);

  const fetchQuizData = async (id) => {
    setLoading(true);
    try {
      const data = await getQuizByCourse(id);
      if (data && data.length > 0) {
        setQuiz(data[0]);
        setError("");
      } else {
        setError("No quiz found for this course yet.");
      }
    } catch (err) {
      console.error("Error fetching quiz:", err);
      setError("Failed to load quiz. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSelect = (id) => {
    setCourseId(id);
  };

  const handleOptionSelect = (index, option) => {
    console.log("Option clicked! Question:", index, "Answer:", option);
    setSelectedAnswers(prev => {
      const updated = {
        ...prev,
        [index]: option
      };
      console.log("Updated answers:", updated);
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Map back to the structure the backend expects
      const formattedAnswers = Object.keys(selectedAnswers).map(index => ({
        questionId: quiz.questions[index]._id, // Ensure this exists, or use a fallback in controller
        questionText: quiz.questions[index].questionText, // Added for extra safety
        selectedAnswer: selectedAnswers[index]
      }));

      const response = await submitQuiz({
        quizId: quiz._id,
        answers: formattedAnswers
      });

      setResults(response);
      setError("");
    } catch (err) {
      console.error("Submission error:", err);
      setError("Failed to submit quiz. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <StudentLayout><div className="loading" style={{ color: "#fff", textAlign: "center", padding: "50px" }}>Loading...</div></StudentLayout>;

  // Show Course Selection if no course selected
  if (!courseId) {
    return (
      <StudentLayout>
        <div className="student-header" style={{ paddingLeft: '0', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '800', background: 'linear-gradient(to right, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Select Your Challenge
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '18px' }}>Prove your expertise in your enrolled subjects.</p>
        </div>

        <div className="courses-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "30px" }}>
          {enrolledCourses.length > 0 ? (
            enrolledCourses.map((course) => (
              <div key={course._id} className="glass-card" style={{
                padding: "0",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(30, 41, 59, 0.7)",
                position: "relative",
                zIndex: 1
              }} onClick={() => handleCourseSelect(course._id)}>
                <div style={{ height: "160px", background: `url(${course.thumbnail || 'https://images.unsplash.com/photo-1510070112810-d4e9a46d9e91?q=80&w=600&auto=format&fit=crop'}) center/cover` }}></div>
                <div style={{ padding: "24px", flex: "1", display: "flex", flexDirection: "column" }}>
                  <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#f8fafc", marginBottom: "8px" }}>{course.title}</h3>
                  <p style={{ fontSize: "14px", color: "#94a3b8", marginBottom: "20px" }}>Instructor: {course.instructor?.name || "Expert"}</p>
                  <button
                    className="action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCourseSelect(course._id);
                    }}
                    style={{
                      marginTop: "auto",
                      background: "linear-gradient(90deg, #6366f1, #a855f7)",
                      borderRadius: "10px",
                      position: "relative",
                      zIndex: 2,
                      pointerEvents: "auto"
                    }}
                  >
                    Start Assessment
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="glass-card" style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px", position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: "64px", marginBottom: "20px" }}>📝</div>
              <h3>No courses found.</h3>
              <p style={{ color: "#94a3b8", marginBottom: "30px" }}>Enroll in a course to start taking quizzes!</p>
              <button
                className="action-btn"
                onClick={() => navigate("/student/courses")}
                style={{
                  background: "linear-gradient(90deg, #3b82f6, #2563eb)",
                  position: "relative",
                  zIndex: 2,
                  pointerEvents: "auto"
                }}
              >
                Explore Courses
              </button>
            </div>
          )}
        </div>
      </StudentLayout>
    );
  }

  if (error) {
    return (
      <StudentLayout>
        <div className="glass-card" style={{ textAlign: "center", padding: "60px", maxWidth: "600px", margin: "40px auto", border: "1px solid rgba(239, 68, 68, 0.2)", position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>⚠️</div>
          <p style={{ color: "#ef4444", fontSize: "20px", fontWeight: "600", marginBottom: "30px" }}>{error}</p>
          <button
            className="action-btn"
            onClick={() => setCourseId("")}
            style={{
              background: "rgba(255,255,255,0.1)",
              position: "relative",
              zIndex: 2,
              pointerEvents: "auto"
            }}
          >
            Go Back to Selection
          </button>
        </div>
      </StudentLayout>
    );
  }

  if (results) {
    const totalQuestions = quiz.questions.length;
    const scorePercent = Math.round((results.score / totalQuestions) * 100);

    return (
      <StudentLayout>
        <div className="quiz-results-container" style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 20px" }}>
          <div className="glass-card" style={{ textAlign: "center", padding: "60px", borderRadius: "32px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(15, 23, 42, 0.8)", position: "relative", zIndex: 1 }}>
            <div style={{ marginBottom: "40px" }}>
              {scorePercent >= 80 ? (
                <div style={{ fontSize: "80px", animation: "bounce 2s infinite" }}>🏆</div>
              ) : scorePercent >= 50 ? (
                <div style={{ fontSize: "80px", animation: "pulse 2s infinite" }}>📈</div>
              ) : (
                <div style={{ fontSize: "80px" }}>🌱</div>
              )}
            </div>

            <h2 style={{ fontSize: "42px", fontWeight: "800", marginBottom: "10px", color: "#f8fafc" }}>Assessment Complete!</h2>
            <p style={{ color: "#94a3b8", fontSize: "18px", marginBottom: "40px" }}>Excellent effort! You've taken another step toward mastery.</p>

            <div className="results-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "30px", marginBottom: "50px" }}>
              <div className="stat-box" style={{ padding: "30px", background: "rgba(59, 130, 246, 0.1)", borderRadius: "24px", border: "1px solid rgba(59, 130, 246, 0.2)" }}>
                <span style={{ display: "block", fontSize: "13px", color: "#60a5fa", textTransform: "uppercase", fontWeight: "700", letterSpacing: "1px", marginBottom: "10px" }}>Your Final Score</span>
                <span style={{ fontSize: "64px", fontWeight: "900", color: "#f8fafc" }}>{results.score}<sub style={{ fontSize: "20px", color: "#94a3b8" }}>/{totalQuestions}</sub></span>
                <p style={{ margin: "5px 0 0", color: "#60a5fa", fontWeight: "600" }}>{scorePercent}% accuracy</p>
              </div>
              <div className="stat-box" style={{ padding: "30px", background: "rgba(168, 85, 247, 0.1)", borderRadius: "24px", border: "1px solid rgba(168, 85, 247, 0.2)" }}>
                <span style={{ display: "block", fontSize: "13px", color: "#a855f7", textTransform: "uppercase", fontWeight: "700", letterSpacing: "1px", marginBottom: "10px" }}>Expertise Level</span>
                <span style={{
                  fontSize: "36px",
                  fontWeight: "800",
                  display: "block",
                  margin: "10px 0",
                  color: results.level === "Master" ? "#10b981" : results.level === "Intermediate" ? "#f59e0b" : "#ef4444"
                }}>
                  {results.level}
                </span>
                <p style={{ margin: "0", color: "#a855f7", fontSize: "12px" }}>Based on global benchmarks</p>
              </div>
            </div>

            <div className="suggestion-box" style={{ textAlign: "left", padding: "30px", borderLeft: "6px solid #3b82f6", background: "rgba(59, 130, 246, 0.05)", borderRadius: "0 20px 20px 0", marginBottom: "60px" }}>
              <h4 style={{ marginBottom: "15px", color: "#f8fafc", fontSize: "22px", display: "flex", alignItems: "center", gap: "10px" }}>
                <span>💡</span> Mentor's Personalized Advice
              </h4>
              <p style={{ fontSize: "17px", color: "#cbd5e1", lineHeight: "1.7", fontStyle: "italic" }}>"{results.suggestions}"</p>
            </div>

            <div className="learning-path-section" style={{ textAlign: "left" }}>
              <h3 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "30px", color: "#f8fafc", display: "flex", alignItems: "center", gap: "10px" }}>
                🎯 Specialized Learning Path For You
              </h3>
              <div className="path-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "25px" }}>
                {results.learningPath?.map((path, idx) => (
                  <a
                    key={idx}
                    href={path.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="path-card"
                    style={{
                      textDecoration: "none",
                      background: "rgba(30, 41, 59, 0.5)",
                      borderRadius: "20px",
                      overflow: "hidden",
                      border: "1px solid rgba(255,255,255,0.05)",
                      transition: "all 0.3s ease",
                      display: "flex",
                      flexDirection: "column",
                      position: "relative",
                      zIndex: 2,
                      pointerEvents: "auto",
                      cursor: "pointer"
                    }}
                  >
                    <div style={{ height: "140px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", padding: "20px" }}>
                      <img src={path.thumbnail} alt={path.platform} style={{ maxWidth: "70%", maxHeight: "70%", objectFit: "contain" }} />
                    </div>
                    <div style={{ padding: "20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <span style={{ fontSize: "11px", color: "#3b82f6", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px" }}>{path.platform}</span>
                        <span style={{ fontSize: "10px", color: "#94a3b8" }}>Premium Resource</span>
                      </div>
                      <h5 style={{ margin: "0", color: "#f8fafc", fontSize: "16px", fontWeight: "600", lineHeight: "1.4" }}>{path.title}</h5>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center", marginTop: "60px" }}>
              <button
                className="action-btn"
                onClick={() => navigate("/student/progress")}
                style={{
                  background: "rgba(59, 130, 246, 0.2)",
                  padding: "15px 30px",
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                  borderRadius: "12px",
                  position: "relative",
                  zIndex: 2,
                  pointerEvents: "auto",
                  cursor: "pointer"
                }}
              >
                📊 View My Progress
              </button>
              <button
                className="action-btn"
                onClick={() => navigate("/student/courses")}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  padding: "15px 30px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  position: "relative",
                  zIndex: 2,
                  pointerEvents: "auto",
                  cursor: "pointer"
                }}
              >
                📚 Back to My Courses
              </button>
              {results.level === "Master" && courseId && (
                <button
                  className="action-btn"
                  onClick={() => {
                    const eligibilityKey = `certificate_eligible_${courseId}`;
                    const titleKey = `certificate_course_title_${courseId}`;
                    localStorage.setItem(eligibilityKey, "true");
                    localStorage.setItem(titleKey, quiz?.title || "");
                    navigate("/student/certificates", {
                      state: {
                        courseId,
                        courseTitle: quiz?.title || "",
                      }
                    });
                  }}
                  style={{
                    background: "linear-gradient(90deg, #10b981, #059669)",
                    padding: "15px 40px",
                    fontWeight: "bold",
                    borderRadius: "12px",
                    boxShadow: "0 10px 20px rgba(16, 185, 129, 0.2)",
                    position: "relative",
                    zIndex: 2,
                    pointerEvents: "auto",
                    cursor: "pointer"
                  }}
                >
                  Claim My Certificate 🎓
                </button>
              )}
            </div>
          </div>
        </div>
      </StudentLayout>
    );
  }

  const answeredCount = Object.keys(selectedAnswers).length;
  const totalQuestions = quiz?.questions.length || 0;
  const progressPercent = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  return (
    <StudentLayout>
      <div className="quiz-header-sticky" style={{
        position: "sticky",
        top: "20px",
        zIndex: 100,
        marginBottom: "40px",
        background: "rgba(15, 23, 42, 0.9)",
        backdropFilter: "blur(10px)",
        padding: "20px",
        borderRadius: "20px",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
          <div>
            <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#f8fafc", margin: 0 }}>{quiz?.title || "Assessment"}</h2>
            <p style={{ color: "#94a3b8", fontSize: "14px", margin: "5px 0 0" }}>Complete every question to view your specialized feedback.</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: "20px", fontWeight: "800", color: "#60a5fa" }}>{answeredCount}</span>
            <span style={{ color: "#64748b", margin: "0 5px" }}>/</span>
            <span style={{ fontSize: "16px", color: "#94a3b8" }}>{totalQuestions}</span>
            <div style={{ fontSize: "10px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", marginTop: "2px" }}>Answered</div>
          </div>
        </div>
        <div style={{ width: "100%", height: "8px", background: "rgba(255,255,255,0.05)", borderRadius: "10px", overflow: "hidden" }}>
          <div style={{ width: `${progressPercent}%`, height: "100%", background: "linear-gradient(90deg, #3b82f6, #a855f7)", transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)" }}></div>
        </div>
      </div>

      <div className="quiz-form-container" style={{ maxWidth: "850px", margin: "0 auto" }}>
        <form onSubmit={handleSubmit}>
          {quiz?.questions.map((q, index) => (
            <div key={q._id || index} className="glass-card" style={{
              marginBottom: "30px",
              padding: "40px",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(30, 41, 59, 0.5)",
              transition: "transform 0.3s ease",
              position: "relative",
              zIndex: 1
            }}>
              <div style={{ display: "flex", gap: "20px", marginBottom: "25px" }}>
                <div style={{
                  minWidth: "40px",
                  height: "40px",
                  background: selectedAnswers[index] ? "rgba(16, 185, 129, 0.1)" : "rgba(255,255,255,0.05)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: selectedAnswers[index] ? "#10b981" : "#64748b",
                  fontWeight: "bold",
                  border: "1px solid",
                  borderColor: selectedAnswers[index] ? "rgba(16, 185, 129, 0.2)" : "rgba(255,255,255,0.05)"
                }}>
                  {selectedAnswers[index] ? "✓" : index + 1}
                </div>
                <p style={{ fontSize: "19px", fontWeight: "600", color: "#f8fafc", lineHeight: "1.5", margin: 0 }}>
                  {q.questionText}
                </p>
              </div>

              <div className="options-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
                {q.options.map((opt, oIdx) => {
                  const isSelected = selectedAnswers[index] === opt;

                  return (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => handleOptionSelect(index, opt)}
                      style={{
                        position: "relative",
                        zIndex: 2,
                        pointerEvents: "auto",
                        width: "100%",
                        padding: "18px 24px",
                        borderRadius: "16px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                        border: "1px solid",
                        borderColor: isSelected ? "#3b82f6" : "rgba(255,255,255,0.05)",
                        background: isSelected ? "rgba(59, 130, 246, 0.1)" : "rgba(255, 255, 255, 0.02)",
                        color: isSelected ? "#fff" : "#cbd5e1",
                        transform: isSelected ? "translateX(10px)" : "none",
                        userSelect: "none",
                        textAlign: "left"
                      }}
                    >
                      <div style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        border: "2px solid",
                        borderColor: isSelected ? "#3b82f6" : "#475569",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: isSelected ? "transparent" : "rgba(0,0,0,0.2)"
                      }}>
                        {isSelected && <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#3b82f6" }}></div>}
                      </div>
                      <span style={{ fontSize: "16px", fontWeight: "500" }}>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="submit-section" style={{
            marginTop: "60px",
            padding: "40px",
            background: "rgba(59, 130, 246, 0.05)",
            borderRadius: "24px",
            border: "1px solid rgba(59, 130, 246, 0.1)",
            textAlign: "center"
          }}>
            <h4 style={{ color: "#60a5fa", marginBottom: "15px" }}>Validation Check</h4>
            {answeredCount < totalQuestions ? (
              <p style={{ color: "#94a3b8", marginBottom: "25px" }}>
                You have answered <strong>{answeredCount}</strong> out of <strong>{totalQuestions}</strong> questions.
                Please answer all questions to unlock your feedback.
              </p>
            ) : (
              <p style={{ color: "#10b981", marginBottom: "25px" }}>
                Perfect! All questions are answered. You're ready to submit.
              </p>
            )}

            <button
              type="submit"
              className="action-btn"
              disabled={submitting || answeredCount < totalQuestions}
              style={{
                width: "100%",
                maxWidth: "400px",
                padding: "20px",
                fontSize: "18px",
                fontWeight: "800",
                background: answeredCount < totalQuestions ? "rgba(255,255,255,0.05)" : "linear-gradient(90deg, #3b82f6, #2563eb)",
                color: answeredCount < totalQuestions ? "#64748b" : "#fff",
                opacity: (submitting || answeredCount < totalQuestions) ? 0.7 : 1,
                cursor: (submitting || answeredCount < totalQuestions) ? "not-allowed" : "pointer",
                borderRadius: "15px",
                boxShadow: answeredCount < totalQuestions ? "none" : "0 10px 30px rgba(59, 130, 246, 0.4)",
                position: "relative",
                zIndex: 2,
                pointerEvents: "auto"
              }}
            >
              {submitting ? "Analyzing Your Expertise..." : "Complete & View Results"}
            </button>
          </div>
        </form>
      </div>
    </StudentLayout>
  );
};

const styles = {
  qCard: {
    background: "rgba(255, 255, 255, 0.05)",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
    border: "1px solid rgba(255, 255, 255, 0.1)"
  },
  optionsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    marginTop: "15px"
  },
  option: {
    padding: "12px 15px",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    gap: "10px",
    transition: "all 0.2s",
    border: "2px solid transparent"
  }
};

export default AttemptQuiz;