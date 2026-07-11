import React, { useEffect, useState } from "react";
import StudentLayout from "../../components/StudentLayout";
import { getStudentProgress } from "../../api/progressApi";
import ProgressChart from "../../components/ProgressChart";

const ProgressPage = () => {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const data = await getStudentProgress();
        setProgress(data);
      } catch (err) {
        console.error("Failed loading progress:", err);
        setError(err?.response?.data?.message || err.message || "Failed to load progress");
      } finally {
        setLoading(false);
      }
    };
    loadProgress();
  }, []);

  return (
    <StudentLayout>
      <div className="student-header" style={{ paddingLeft: '0', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '36px', fontWeight: '800', background: 'linear-gradient(to right, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Your Performance Deep Dive
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '18px' }}>Real-time analytics of your academic growth and skill mastery.</p>
      </div>

      <div className="progress-container" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>
        {error ? (
          <div className="glass-card" style={{ padding: '30px', background: 'rgba(241, 245, 249, 0.05)', border: '1px solid rgba(248, 113, 113, 0.25)', borderRadius: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '22px', color: '#fecaca' }}>Unable to load progress</h3>
            <p style={{ marginTop: '12px', color: '#f8fafc' }}>{error}</p>
          </div>
        ) : loading ? (
          <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '22px', color: '#cbd5e1' }}>Loading progress...</h3>
          </div>
        ) : (
          <>
            <div className="glass-card" style={{ padding: '40px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px' }}>
              <ProgressChart progress={progress} />
            </div>

            <div className="recent-quizzes-section">
              <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#f8fafc', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '28px' }}>📝</span> Recent Assessment History
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
                {progress.flatMap(p => p.quizzesAttempted || []).length > 0 ? (
                  progress.flatMap(p => p.quizzesAttempted || []).sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)).map((attempt, idx) => (
                    <div key={idx} className="glass-card" style={{ padding: '25px', background: 'rgba(30, 41, 59, 0.4)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '18px', color: '#f8fafc' }}>{attempt.quiz?.title || "Quiz"}</h4>
                          <p style={{ margin: '5px 0 0', fontSize: '12px', color: '#64748b' }}>Submitted on {new Date(attempt.submittedAt).toLocaleDateString()}</p>
                        </div>
                        <div style={{
                          padding: '5px 12px',
                          borderRadius: '10px',
                          background: attempt.level === "Master" ? "rgba(16, 185, 129, 0.1)" : attempt.level === "Intermediate" ? "rgba(245, 158, 11, 0.1)" : "rgba(239, 68, 68, 0.1)",
                          color: attempt.level === "Master" ? "#10b981" : attempt.level === "Intermediate" ? "#f59e0b" : "#ef4444",
                          fontSize: '12px',
                          fontWeight: '700',
                          textTransform: 'uppercase'
                        }}>
                          {attempt.level}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                        <span style={{ fontSize: '32px', fontWeight: '800', color: '#f8fafc' }}>{attempt.score}</span>
                        <span style={{ fontSize: '16px', color: '#64748b' }}>/ {attempt.quiz?.totalMarks || 20} Marks</span>
                        <span style={{ marginLeft: 'auto', color: '#60a5fa', fontWeight: '600' }}>
                          {Math.round((attempt.score / (attempt.quiz?.totalMarks || 20)) * 100)}%
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="glass-card" style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', opacity: 0.6 }}>
                    <p>No quiz attempts found. Start an assessment to see your history!</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </StudentLayout>
  );
};

export default ProgressPage;
