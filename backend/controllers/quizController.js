const Quiz = require("../models/Quiz");
const QuizAttempt = require("../models/QuizAttempt");
const Course = require("../models/Course");

// Helper for platform thumbnails and links
const PLATFORMS = {
  Guvi: {
    link: "https://www.guvi.in/courses",
    thumbnail: "https://www.guvi.in/blog/wp-content/uploads/2022/10/GUVI-Logo.png"
  },
  GreatLearning: {
    link: "https://www.mygreatlearning.com/academy",
    thumbnail: "https://d1vwxdpzbg14d2.cloudfront.net/assets/great-learning-logo-5f6a9645.png"
  },
  Edureka: {
    link: "https://www.edureka.co/all-courses",
    thumbnail: "https://www.edureka.co/blog/wp-content/uploads/2016/10/edureka-logo.png"
  },
  Udemy: {
    link: "https://www.udemy.com/courses/search/?q=",
    thumbnail: "https://www.udemy.com/staticback/menu/logo-udemy.svg"
  }
};

exports.generateAIQuiz = async (req, res) => {
  const { courseId } = req.body;
  const course = await Course.findById(courseId);
  if (!course) return res.status(404).json({ message: "Course not found" });

  const prompt = `Generate exactly 20 multiple-choice questions for the course titled "${course.title}". 
  Course Description: "${course.description}".
  Return the result ONLY as a JSON array of objects with the following format:
  [{"questionText": "Question here?", "options": ["A", "B", "C", "D"], "correctAnswer": "Exact option string here"}]`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "MERN Academy"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();
    const aiContent = data.choices[0].message.content;
    const questions = JSON.parse(aiContent.substring(aiContent.indexOf('['), aiContent.lastIndexOf(']') + 1));

    res.json({ title: `AI Assessment: ${course.title}`, questions });
  } catch (error) {
    console.error("AI Generation failed:", error);
    res.status(500).json({ message: "Failed to generate AI quiz. Check your API key or connection." });
  }
};

exports.createQuiz = async (req, res) => {
  const { courseId, title, questions } = req.body;
  const quiz = await Quiz.create({
    course: courseId,
    title,
    questions,
    totalMarks: questions.length
  });
  res.status(201).json(quiz);
};

exports.submitQuiz = async (req, res) => {
  const { quizId, answers } = req.body;
  const quiz = await Quiz.findById(quizId).populate("course");

  let score = 0;
  quiz.questions.forEach((q, index) => {
    // Try to find the answer by ID first, then by the text (fallback)
    const ans = answers.find((a) =>
      (a.questionId && a.questionId == q._id) ||
      (a.questionText && a.questionText === q.questionText)
    );

    if (ans && ans.selectedAnswer === q.correctAnswer) score++;
  });

  const percentage = (score / quiz.questions.length) * 100;
  let level = "Beginner";
  let suggestions = "";
  let learningLinks = [];

  if (percentage >= 80) {
    level = "Master";
    suggestions = "🏆 Exceptional Performance! Your mastery of these concepts mirrors the standards of industry leaders like Guvi and Great Learning. You have demonstrated a deep understanding of the core architecture and specialized implementation details. We recommend you now focus on high-impact projects and advanced scalability patterns.";
    learningLinks = [
      { platform: "Udemy", title: "Scale to Millions: Advanced System Design", link: PLATFORMS.Udemy.link + quiz.course.title + " advanced system design", thumbnail: PLATFORMS.Udemy.thumbnail },
      { platform: "Guvi", title: "Premium Industry Projects & Mentorship", link: PLATFORMS.Guvi.link, thumbnail: PLATFORMS.Guvi.thumbnail }
    ];
  } else if (percentage >= 50) {
    level = "Intermediate";
    suggestions = "📈 Solid Foundation! Just like the career-path modules on Great Learning, you have grasped the essential concepts but have room to master complex edge cases. We recommend a structured deep-dive into practical debugging and performance optimization to reach the next tier.";
    learningLinks = [
      { platform: "Edureka", title: "Professional Certification Program", link: PLATFORMS.Edureka.link, thumbnail: PLATFORMS.Edureka.thumbnail },
      { platform: "GreatLearning", title: "Advanced Specialized Bootcamps", link: PLATFORMS.GreatLearning.link, thumbnail: PLATFORMS.GreatLearning.thumbnail }
    ];
  } else {
    level = "Beginner";
    suggestions = "🌱 Great Start! Every expert at Guvi started exactly where you are. You've taken the first crucial step into a broader world of knowledge. Focus on strengthening your fundamental pillars and interactive coding exercises to build the confidence needed for advanced topics.";
    learningLinks = [
      { platform: "Guvi", title: "Zero to Hero: Foundation Series", link: PLATFORMS.Guvi.link, thumbnail: PLATFORMS.Guvi.thumbnail },
      { platform: "GreatLearning", title: "Essential Concepts Path", link: PLATFORMS.GreatLearning.link, thumbnail: PLATFORMS.GreatLearning.thumbnail }
    ];
  }

  const attempt = await QuizAttempt.create({
    quiz: quizId,
    student: req.user.id,
    answers,
    score,
    level,
    suggestions,
    learningPath: learningLinks
  });

  res.json(attempt);
};

exports.getQuizByCourse = async (req, res) => {
  try {
    const quizzes = await Quiz.find({
      course: req.params.courseId,
      isPublished: true
    });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching quiz", error: error.message });
  }
};
