const express = require("express");
const {
  createQuiz,
  submitQuiz,
  generateAIQuiz,
  getQuizByCourse,
} = require("../controllers/quizController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", protect, authorize("instructor"), createQuiz);
router.post("/generate-ai", protect, authorize("instructor"), generateAIQuiz);
router.post("/submit", protect, authorize("student"), submitQuiz);
router.get("/course/:courseId", protect, getQuizByCourse);

module.exports = router;
