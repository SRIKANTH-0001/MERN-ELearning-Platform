const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },

  options: {
    type: [String],
    required: true,
  },

  correctAnswer: {
    type: String,
    required: true,
  },
});

const quizSchema = new mongoose.Schema(
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

    questions: [questionSchema],

    totalMarks: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true, // Defaulting to true for now so existing quizzes show up
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", quizSchema);
