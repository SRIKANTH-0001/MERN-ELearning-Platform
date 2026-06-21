const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const { protect } = require("../middleware/authMiddleware");

// Get chat history between two users
router.get("/direct/:userId", protect, async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50, skip = 0 } = req.query;

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate("sender", "name email");

    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ message: "Error fetching chat history", error: error.message });
  }
});

// Get course discussion messages
router.get("/course/:courseId", protect, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { limit = 50, skip = 0 } = req.query;

    const messages = await Message.find({ course: courseId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate("sender", "name email");

    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ message: "Error fetching course messages", error: error.message });
  }
});

// Get unread message count
router.get("/unread/count", protect, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user._id,
      isRead: false
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: "Error fetching unread count", error: error.message });
  }
});

// Get recent conversations
router.get("/conversations", protect, async (req, res) => {
  try {
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: req.user._id },
            { receiver: req.user._id }
          ],
          course: null
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$sender", req.user._id] },
              "$receiver",
              "$sender"
            ]
          },
          lastMessage: { $first: "$$ROOT" },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$receiver", req.user._id] },
                    { $eq: ["$isRead", false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $project: {
          user: {
            _id: 1,
            name: 1,
            email: 1
          },
          lastMessage: 1,
          unreadCount: 1
        }
      },
      {
        $sort: { "lastMessage.createdAt": -1 }
      }
    ]);

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching conversations", error: error.message });
  }
});

// Search for users to start a new chat
router.get("/search", protect, async (req, res) => {
  try {
    const { query } = req.query;
    const filter = {
      _id: { $ne: req.user._id },
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } }
      ]
    };

    // If student, prioritize instructors. If instructor, prioritize students.
    if (req.user.role === "student") {
      filter.role = "instructor";
    } else if (req.user.role === "instructor") {
      filter.role = "student";
    }

    const User = require("../models/User");
    const users = await User.find(filter).select("name email role").limit(10);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error searching users", error: error.message });
  }
});

module.exports = router;
