const Course = require("../models/Course");

exports.createCourse = async (req, res) => {
  const { title, description } = req.body;

  const course = await Course.create({
    title,
    description,
    instructor: req.user.id,
  });

  res.status(201).json(course);
};
