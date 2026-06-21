const express = require("express");
const { createCourse } = require("../controllers/instructorController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/course", protect, authorize("instructor"), createCourse);

module.exports = router;
