const Content = require("../models/Content");

exports.addContent = async (req, res) => {
  const content = await Content.create(req.body);
  res.status(201).json(content);
};

exports.getCourseContent = async (req, res) => {
  const contents = await Content.find({ course: req.params.courseId });
  res.json(contents);
};
