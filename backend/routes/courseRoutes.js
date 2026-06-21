const express = require("express");
const {
  getAllCourses,
  enrollCourse,
  getEnrolledCourses,
  getCourseById,
} = require("../controllers/courseController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getAllCourses);
router.get("/enrolled", protect, getEnrolledCourses);
router.get("/:id", getCourseById);
router.post("/enroll/:id", protect, enrollCourse);

module.exports = router;
