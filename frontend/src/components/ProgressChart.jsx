const ProgressChart = ({ progress }) => {
  if (!progress || progress.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>📊</div>
        <h4>No progress data available yet.</h4>
        <p>Start learning to see your performance metrics!</p>
      </div>
    );
  }

  return (
    <div className="progress-analysis" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div className="course-progress-section">
        <h4 style={{ marginBottom: '20px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: '#3b82f6' }}>📈</span> Course Completion Accuracy
        </h4>
        <div style={{ display: 'grid', gap: '20px' }}>
          {progress.map((item) => (
            <div key={item._id} className="progress-item glass-card" style={{ padding: '20px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(30, 41, 59, 0.4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
                <span style={{ fontWeight: '600', color: '#f8fafc' }}>{item.course?.title}</span>
                <span style={{ fontSize: '14px', color: '#60a5fa', fontWeight: '700' }}>{item.completionPercentage}%</span>
              </div>
              <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                    width: `${item.completionPercentage}%`,
                    borderRadius: '10px',
                    transition: 'width 1s cubic-bezier(0.1, 0.7, 1.0, 0.1)'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="quiz-briefing glass-card" style={{ padding: '30px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h4 style={{ marginBottom: '15px' }}>🚀 Skill Mastery Overview</h4>
        <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6' }}>
          You've attempted <strong>{progress.reduce((acc, p) => acc + (p.quizzesAttempted?.length || 0), 0)}</strong> quizzes.
          Your current trajectory shows consistent improvement in technical agility and conceptual depth.
          Claim your certificates on the next page to validate your expertise.
        </p>
      </div>
    </div>
  );
};

export default ProgressChart;
