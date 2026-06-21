const express = require("express");
const { issueCertificate } = require("../controllers/certificateController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", protect, authorize("student"), issueCertificate);

module.exports = router;
