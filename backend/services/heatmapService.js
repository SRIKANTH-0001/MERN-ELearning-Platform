/**
 * Engagement heatmap data generator
 * @param {Array} progressRecords
 * @returns {Array}
 */
const generateHeatmapData = (progressRecords) => {
  return progressRecords.map((record) => ({
    courseId: record.course,
    completion: record.completionPercentage,
    status: record.isCompleted ? "Completed" : "In Progress",
  }));
};

module.exports = { generateHeatmapData };
