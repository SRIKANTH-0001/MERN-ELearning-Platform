const express = require("express");
const {
  sendNotification,
  getNotifications,
} = require("../controllers/notificationController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, sendNotification);
router.get("/", protect, getNotifications);

module.exports = router;
