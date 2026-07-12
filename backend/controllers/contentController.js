const Content = require("../models/Content");
const Progress = require("../models/Progress");
const Quiz = require("../models/Quiz");

const syncProgressRecord = async (progressRecord) => {
  const [contentCount, quizCount] = await Promise.all([
    Content.countDocuments({ course: progressRecord.course }),
    Quiz.countDocuments({ course: progressRecord.course }),
  ]);

  const completedContentCount = progressRecord.completedContents?.length || 0;
  const attemptedQuizCount = progressRecord.quizzesAttempted?.length || 0;
  const totalSteps = contentCount + quizCount;
  const completionPercentage = totalSteps > 0
    ? Math.round(((completedContentCount + attemptedQuizCount) / totalSteps) * 100)
    : 0;

  progressRecord.completionPercentage = completionPercentage;
  progressRecord.isCompleted = contentCount > 0
    ? completedContentCount >= contentCount
    : attemptedQuizCount >= quizCount;

  await progressRecord.save();
  return progressRecord;
};

exports.addContent = async (req, res) => {
  const content = await Content.create(req.body);
  res.status(201).json(content);
};

exports.getCourseContent = async (req, res) => {
  const contents = await Content.find({ course: req.params.courseId });
  res.json(contents);
};

exports.markContentCompleted = async (req, res) => {
  const { contentId } = req.params;
  const content = await Content.findById(contentId);

  if (!content) {
    return res.status(404).json({ message: "Content not found" });
  }

  let progressRecord = await Progress.findOne({
    student: req.user.id,
    course: content.course,
  });

  if (!progressRecord) {
    progressRecord = await Progress.create({
      student: req.user.id,
      course: content.course,
      completedContents: [],
      quizzesAttempted: [],
      completionPercentage: 0,
      isCompleted: false,
    });
  }

  const alreadyCompleted = progressRecord.completedContents.some(
    (completedId) => completedId.toString() === contentId
  );

  if (!alreadyCompleted) {
    progressRecord.completedContents.push(content._id);
  }

  const updatedProgress = await syncProgressRecord(progressRecord);

  res.json({
    message: "Content marked as completed",
    completed: true,
    progress: updatedProgress,
  });
};
