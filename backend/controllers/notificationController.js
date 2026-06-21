const Notification = require("../models/Notification");

exports.sendNotification = async (req, res) => {
  const notification = await Notification.create(req.body);
  res.status(201).json(notification);
};

exports.getNotifications = async (req, res) => {
  const notes = await Notification.find({ user: req.user.id });
  res.json(notes);
};
