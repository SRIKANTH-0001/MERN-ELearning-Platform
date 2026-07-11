const express = require("express");
const { issueCertificate, getCertificateStatusByCourse, markCertificateDownloaded } = require("../controllers/certificateController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", protect, authorize("student"), issueCertificate);
router.get("/course/:courseId", protect, authorize("student"), getCertificateStatusByCourse);
router.put("/course/:courseId/download", protect, authorize("student"), markCertificateDownloaded);

module.exports = router;
