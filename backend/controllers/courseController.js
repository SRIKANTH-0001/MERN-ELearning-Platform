const Course = require("../models/Course");

exports.getAllCourses = async (req, res) => {
  const courses = await Course.find().populate("instructor", "name email");
  res.json(courses);
};

exports.enrollCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: "Course not found" });

  const studentId = req.user._id.toString();
  const isEnrolled = course.studentsEnrolled.some(id => id.toString() === studentId);

  if (!isEnrolled) {
    course.studentsEnrolled.push(req.user._id);
    await course.save();
  }

  res.json({ message: "Enrolled successfully" });
};

exports.getEnrolledCourses = async (req, res) => {
  try {
    const courses = await Course.find({ studentsEnrolled: req.user._id }).populate("instructor", "name email");
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching enrolled courses", error: error.message });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("instructor", "name email");
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: "Error fetching course", error: error.message });
  }
};
