/**
 * Adaptive learning recommendation (rule-based)
 * @param {Number} completionPercentage
 * @returns {String}
 */
const recommendNextStep = (completionPercentage) => {
  if (completionPercentage < 30) {
    return "Focus on introductory modules and revise basics.";
  }

  if (completionPercentage < 70) {
    return "Continue with intermediate lessons and practice quizzes.";
  }

  return "Proceed to advanced topics and final assessments.";
};

module.exports = { recommendNextStep };
