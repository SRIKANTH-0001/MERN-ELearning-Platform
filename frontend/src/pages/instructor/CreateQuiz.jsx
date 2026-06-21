import React, { useState, useEffect } from "react";
import InstructorLayout from "../../components/InstructorLayout";
import { createQuiz, generateAIQuiz } from "../../api/quizApi";
import { getAllCourses } from "../../api/courseApi";

const CreateQuiz = () => {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState("");
  const [message, setMessage] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getAllCourses();
        setCourses(data);
      } catch (err) {
        console.error("Failed to fetch courses");
      }
    };
    fetchCourses();
  }, []);

  const handleAIGeneration = async () => {
    if (!courseId) return setMessage("Please select a course first!");
    setLoadingAI(true);
    setMessage("AI is analyzing course content & generating 20 questions... Please wait.");
    try {
      const data = await generateAIQuiz(courseId);
      setTitle(data.title);
      setQuestions(JSON.stringify(data.questions, null, 2));
      setMessage("AI Content Generated! Review below and click 'Create Quiz' to save.");
    } catch (err) {
      setMessage("Failed to generate AI quiz. Ensure API key is set.");
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const parsedQuestions = JSON.parse(questions);
      await createQuiz({ courseId, title, questions: parsedQuestions });
      setMessage("Quiz created successfully and published for students!");
      setCourseId("");
      setTitle("");
      setQuestions("");
    } catch (error) {
      setMessage("Failed to create quiz. Please check your JSON format.");
    }
  };

  return (
    <InstructorLayout>
      <div className="instructor-header">
        <h2>✨ AI Quiz Generator</h2>
        <p>Generate high-quality assessments automatically using AI.</p>
      </div>

      <div className="instructor-form-container">
        <div className="ai-controls" style={{ marginBottom: "30px", padding: "20px", background: "rgba(255,255,255,0.05)", borderRadius: "15px", border: "1px dashed rgba(255,255,255,0.2)" }}>
          <h4 style={{ marginBottom: "15px" }}>Instant AI Generation</h4>
          <div className="form-group">
            <label className="form-label">Select Course</label>
            <select
              className="form-input"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              style={{ background: "#2d3748", color: "#fff" }}
            >
              <option value="">-- Choose a course --</option>
              {courses.map(c => (
                <option key={c._id} value={c._id}>{c.title}</option>
              ))}
            </select>
          </div>
          <button
            type="button"
            className="ai-gen-btn"
            onClick={handleAIGeneration}
            disabled={loadingAI}
            style={{
              width: "100%",
              padding: "12px",
              background: "linear-gradient(45deg, #6366f1, #a855f7)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontWeight: "700",
              cursor: loadingAI ? "not-allowed" : "pointer",
              opacity: loadingAI ? 0.7 : 1
            }}
          >
            {loadingAI ? "🤖 Generating Questions (20)..." : "⚡ Generate 20 Questions with AI"}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="instructor-form">
          <div className="form-group">
            <label className="form-label">Quiz Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., Final Mastery Assessment"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Quiz Content (Review & Edit)</label>
            <textarea
              className="form-textarea"
              placeholder='Click generate above or paste JSON questions here...'
              value={questions}
              onChange={(e) => setQuestions(e.target.value)}
              required
              style={{ fontFamily: "monospace", minHeight: "300px", fontSize: "14px" }}
            />
          </div>

          <button type="submit" className="submit-btn" style={{ width: "100%", padding: "15px" }}>
            Confirm and Publish Quiz
          </button>

          {message && (
            <div className={`message-banner ${message.includes("success") ? "success" : "info"}`} style={{
              marginTop: "20px",
              padding: "15px",
              borderRadius: "8px",
              background: message.includes("success") ? "rgba(34,197,94,0.2)" : "rgba(59,130,246,0.2)",
              color: message.includes("success") ? "#86efac" : "#93c5fd",
              textAlign: "center"
            }}>
              {message}
            </div>
          )}
        </form>
      </div>
    </InstructorLayout>
  );
};

export default CreateQuiz;
