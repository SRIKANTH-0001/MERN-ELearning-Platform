/**
 * Real-time quiz grading service
 * @param {Array} questions - Quiz questions from DB
 * @param {Array} answers - Student submitted answers
 * @returns {Number} score
 */
const gradeQuiz = (questions, answers) => {
  let score = 0;

  questions.forEach((question) => {
    const submitted = answers.find(
      (ans) => String(ans.questionId) === String(question._id)
    );

    if (
      submitted &&
      submitted.selectedAnswer === question.correctAnswer
    ) {
      score += 1;
    }
  });

  return score;
};

module.exports = { gradeQuiz };
