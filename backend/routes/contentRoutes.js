const express = require("express");
const {
  addContent,
  getCourseContent,
  markContentCompleted,
} = require("../controllers/contentController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", protect, authorize("instructor"), addContent);
router.post("/complete/:contentId", protect, markContentCompleted);
router.get("/:courseId", protect, getCourseContent);

module.exports = router;
