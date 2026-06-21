const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["video", "pdf", "link", "text"],
      required: true,
    },

    resourceUrl: {
      type: String,
      required: true,
    },

    order: {
      type: Number,
      default: 1,
    },
    thumbnailUrl: {
      type: String,
    },
    platform: {
      type: String,
      enum: ["youtube", "udemy", "guvi", "edureka", "other"],
      default: "other",
    },
    duration: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Content", contentSchema);
