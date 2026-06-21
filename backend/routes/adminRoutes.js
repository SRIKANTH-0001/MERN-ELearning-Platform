const express = require("express");
const {
  getAdminDashboard,
  getAllUsers,
} = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/dashboard", protect, authorize("admin"), getAdminDashboard);
router.get("/users", protect, authorize("admin"), getAllUsers);

module.exports = router;
