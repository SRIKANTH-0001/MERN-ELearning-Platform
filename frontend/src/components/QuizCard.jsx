import React from "react";

const QuizCard = ({ quiz, onAttempt }) => {
  return (
    <div style={styles.card}>
      <h4>{quiz.title}</h4>
      <p>Total Questions: {quiz.questions.length}</p>
      <button style={styles.button} onClick={() => onAttempt(quiz._id)}>
        Attempt Quiz
      </button>
    </div>
  );
};

const styles = {
  card: {
    background: "#f8fafc",
    padding: "18px",
    borderRadius: "10px",
    marginBottom: "15px",
  },
  button: {
    padding: "6px 14px",
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default QuizCard;
