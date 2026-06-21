const Certificate = require("../models/Certificate");
const crypto = require("crypto");

exports.issueCertificate = async (req, res) => {
  const cert = await Certificate.create({
    student: req.user._id,
    course: req.body.courseId,
    certificateId: crypto.randomBytes(8).toString("hex"),
  });

  res.status(201).json(cert);
};
