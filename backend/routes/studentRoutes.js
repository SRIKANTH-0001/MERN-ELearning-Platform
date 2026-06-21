const express = require("express");
const { getDashboardStats } = require("../controllers/studentController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/dashboard/stats", protect, getDashboardStats);

module.exports = router;
