const User = require("../models/User");
const Course = require("../models/Course");

exports.getAdminDashboard = async (req, res) => {
  const users = await User.countDocuments();
  const courses = await Course.countDocuments();
  res.json({ users, courses });
};

exports.getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};
