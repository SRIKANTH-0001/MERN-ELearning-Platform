const Certificate = require("../models/Certificate");
const crypto = require("crypto");

exports.issueCertificate = async (req, res) => {
  const { courseId } = req.body;
  if (!courseId) {
    return res.status(400).json({ message: "courseId is required" });
  }

  const existingCertificate = await Certificate.findOne({
    student: req.user._id,
    course: courseId,
  });

  if (existingCertificate) {
    return res.status(200).json(existingCertificate);
  }

  const cert = await Certificate.create({
    student: req.user._id,
    course: courseId,
    certificateId: `CERT-${crypto.randomBytes(4).toString("hex").toUpperCase()}`,
  });

  res.status(201).json(cert);
};

exports.getCertificateStatusByCourse = async (req, res) => {
  const { courseId } = req.params;

  const certificate = await Certificate.findOne({
    student: req.user._id,
    course: courseId,
  });

  if (!certificate) {
    return res.status(200).json({
      eligible: false,
      downloaded: false,
    });
  }

  res.status(200).json({
    eligible: true,
    downloaded: certificate.downloaded,
    certificateId: certificate.certificateId,
    issuedAt: certificate.issuedAt,
  });
};

exports.markCertificateDownloaded = async (req, res) => {
  const { courseId } = req.params;

  const certificate = await Certificate.findOne({
    student: req.user._id,
    course: courseId,
  });

  if (!certificate) {
    return res.status(404).json({ message: "Certificate not found" });
  }

  if (!certificate.downloaded) {
    certificate.downloaded = true;
    certificate.downloadedAt = new Date();
    await certificate.save();
  }

  res.status(200).json(certificate);
};
