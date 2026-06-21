const Progress = require("../models/Progress");

exports.getAnalytics = async (req, res) => {
  const completed = await Progress.countDocuments({ isCompleted: true });
  const ongoing = await Progress.countDocuments({ isCompleted: false });

  res.json({ completed, ongoing });
};
