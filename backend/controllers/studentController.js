const Course = require("../models/Course");
const QuizAttempt = require("../models/QuizAttempt");
const Certificate = require("../models/Certificate");

exports.getDashboardStats = async (req, res) => {
    try {
        const studentId = req.user._id;

        const [enrolledCourses, quizAttempts, certificates] = await Promise.all([
            Course.countDocuments({ studentsEnrolled: studentId }),
            QuizAttempt.countDocuments({ student: studentId }),
            Certificate.countDocuments({ student: studentId })
        ]);

        // Calculate avg. performance
        const allAttempts = await QuizAttempt.find({ student: studentId }).populate("quiz");
        let avgPerformance = 0;
        if (allAttempts.length > 0) {
            const totalScore = allAttempts.reduce((sum, att) => sum + (att.score || 0), 0);
            const totalPossible = allAttempts.reduce((sum, att) => {
                return sum + (att.quiz?.questions?.length || 0);
            }, 0);
            avgPerformance = Math.round((totalScore / totalPossible) * 100) || 0;
        }

        res.json({
            enrolledCourses: enrolledCourses.toString(),
            quizAttempts: quizAttempts.toString(),
            certificatesEarned: certificates.toString(),
            avgPerformance: `${avgPerformance}%`
        });
    } catch (err) {
        console.error("Dashboard Stats Error:", err);
        res.status(500).json({ message: "Failed to fetch dashboard statistics" });
    }
};
