const Progress = require("../models/Progress");

exports.getProgress = async (req, res) => {
  const progress = await Progress.find({
    student: req.user.id,
  }).populate("course").populate({
    path: "quizzesAttempted",
    populate: { path: "quiz" }
  });

  res.json(progress);
};
