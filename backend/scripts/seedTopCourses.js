const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Course = require("../models/Course");
const Content = require("../models/Content");
const Quiz = require("../models/Quiz");

dotenv.config();

const seedTopCourses = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for Premium Seeding...");

        // 1. Create/Find System Instructor
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("instructor123", salt);

        let instructor = await User.findOne({ email: "instructor@mernacademy.com" });
        if (!instructor) {
            instructor = await User.create({
                name: "MERN Academy Expert",
                email: "instructor@mernacademy.com",
                password: hashedPassword,
                role: "instructor"
            });
            console.log("Instructor created.");
        }

        // 2. Clear existing course-related data
        await Course.deleteMany({});
        await Content.deleteMany({});
        await Quiz.deleteMany({});
        console.log("Database cleared for curated content.");

        const topCourses = [
            {
                title: "Full Stack Web Development (GUVI Integration)",
                description: "Master MERN stack development with step-by-step guidance. High-quality curriculum curated from industry experts at Guvi.",
                thumbnailUrl: "/fullstack_mern.png",
                lessons: [
                    { title: "HTML & CSS Best Practices", platform: "guvi", url: "https://www.youtube.com/watch?v=OXGznpKZ_sA", duration: "18:24" },
                    { title: "JavaScript ES6+ Deep Dive", platform: "guvi", url: "https://www.youtube.com/watch?v=W6NZfCO5SIk", duration: "25:10" },
                    { title: "React Essentials", platform: "guvi", url: "https://www.youtube.com/watch?v=Ke90Tje7VS0", duration: "32:15" },
                    { title: "Node.js & Express APIs", platform: "guvi", url: "https://www.youtube.com/watch?v=Oe421EPjeBE", duration: "28:40" },
                    { title: "MongoDB Atlas Deployment", platform: "guvi", url: "https://www.youtube.com/watch?v=rPq6av6G0v8", duration: "15:20" }
                ],
                quiz: {
                    title: "Web Development Mastery Quiz",
                    questions: [
                        { questionText: "What does MERN stand for?", options: ["MongoDB, Express, React, Node", "MySQL, Express, React, Node", "MongoDB, Ember, React, Node", "MySQL, Express, Ruby, Node"], correctAnswer: "MongoDB, Express, React, Node" },
                        { questionText: "Which hook is used for side effects in React?", options: ["useState", "useContext", "useEffect", "useReducer"], correctAnswer: "useEffect" }
                    ]
                }
            },
            {
                title: "Data Science & Machine Learning (Great Learning)",
                description: "Comprehensive Data Science course with Great Learning's curriculum. Learn Python, Pandas, and Scikit-Learn.",
                thumbnailUrl: "/data_science.png",
                lessons: [
                    { title: "Python for Data Science", platform: "guvi", url: "https://www.youtube.com/watch?v=rfscVS0vtbw", duration: "45:00" },
                    { title: "Data Visualization with Matplotlib", platform: "guvi", url: "https://www.youtube.com/watch?v=DAQNHzOcO5A", duration: "22:15" },
                    { title: "Exploratory Data Analysis", platform: "guvi", url: "https://www.youtube.com/watch?v=mDsh3w28D70", duration: "35:10" },
                    { title: "Linear Regression Explained", platform: "guvi", url: "https://www.youtube.com/watch?v=E5Rqz9noIn8", duration: "28:30" },
                    { title: "Machine Learning Projects", platform: "guvi", url: "https://www.youtube.com/watch?v=i_LwzRVP7bg", duration: "55:20" }
                ],
                quiz: {
                    title: "Data Science Foundations Quiz",
                    questions: [
                        { questionText: "Which library is used for DataFrames in Python?", options: ["NumPy", "Pandas", "Matplotlib", "Seaborn"], correctAnswer: "Pandas" },
                        { questionText: "What type of learning is Linear Regression?", options: ["Supervised", "Unsupervised", "Reinforcement", "Semi-supervised"], correctAnswer: "Supervised" }
                    ]
                }
            },
            {
                title: "Mastering React & Redux (Udemy Expert)",
                description: "Pro-level React training inspired by top-rated Udemy courses. Master state management and modern architecture.",
                thumbnailUrl: "/react_mastery.png",
                lessons: [
                    { title: "React Components & Props", platform: "udemy", url: "https://www.youtube.com/watch?v=hQAHSlTtcmY", duration: "20:05" },
                    { title: "Redux Toolkit Overview", platform: "udemy", url: "https://www.youtube.com/watch?v=9zySeP5vH2M", duration: "18:45" },
                    { title: "Async Actions with Thunk", platform: "udemy", url: "https://www.youtube.com/watch?v=fIESdbS5_9c", duration: "22:10" },
                    { title: "React Router v6", platform: "udemy", url: "https://www.youtube.com/watch?v=Ul3y1LXxzdU", duration: "15:30" },
                    { title: "Advanced Patterns (Compound Components)", platform: "udemy", url: "https://www.youtube.com/watch?v=3IDN_9O_W0A", duration: "30:00" }
                ],
                quiz: {
                    title: "Advanced React Quiz",
                    questions: [
                        { questionText: "What is the primary purpose of Redux?", options: ["Rendering UI", "State Management", "Routing", "API Fetching"], correctAnswer: "State Management" },
                        { questionText: "How do you define a route in React Router v6?", options: ["<Route component={...}>", "<Route element={...}>", "<Route render={...}>", "<Route path={...}>"], correctAnswer: "<Route element={...}>" }
                    ]
                }
            },
            {
                title: "Python for Automation (YouTube Academy)",
                description: "Learn how to automate boring tasks with Python. Real-world scripting projects from top technical creators.",
                thumbnailUrl: "/python_automation.png",
                lessons: [
                    { title: "Web Scraping with BeautifulSoup", platform: "youtube", url: "https://www.youtube.com/watch?v=87Gx3301WpI", duration: "25:40" },
                    { title: "Automating Excel Files", platform: "youtube", url: "https://www.youtube.com/watch?v=SLXW7WdghU8", duration: "20:15" },
                    { title: "Building a Discord Bot", platform: "youtube", url: "https://www.youtube.com/watch?v=HXV3zeQKqGY", duration: "35:00" },
                    { title: "File System Operations", platform: "youtube", url: "https://www.youtube.com/watch?v=Z_K79-v4Eis", duration: "18:20" },
                    { title: "API Integration Scripts", platform: "youtube", url: "https://www.youtube.com/watch?v=M97n9E_KIno", duration: "22:45" }
                ],
                quiz: {
                    title: "Python Automation Quiz",
                    questions: [
                        { questionText: "Which library is common for web scraping?", options: ["BeautifyJS", "BeautifulSoup", "ScraperPlus", "WebLens"], correctAnswer: "BeautifulSoup" },
                        { questionText: "What keyword is used to handle exceptions in Python?", options: ["catch", "try", "error", "handle"], correctAnswer: "try" }
                    ]
                }
            },
            {
                title: "UI/UX Design Masterclass (Edureka Pro)",
                description: "Modern UI/UX design training following Edureka's industry-leading standards. Master Figma and Case Studies.",
                thumbnailUrl: "/ui_ux_design.png",
                lessons: [
                    { title: "Introduction to User Experience", platform: "edureka", url: "https://www.youtube.com/watch?v=c9Wg6A_9f4U", duration: "28:15" },
                    { title: "Figma Fundamentals", platform: "edureka", url: "https://www.youtube.com/watch?v=jk1T6baJz2M", duration: "45:30" },
                    { title: "Color Theory & Typography", platform: "edureka", url: "https://www.youtube.com/watch?v=S26U7W4nQyU", duration: "22:10" },
                    { title: "Interaction Design Basics", platform: "edureka", url: "https://www.youtube.com/watch?v=5Uf3pS9_BvI", duration: "19:40" },
                    { title: "Portfolio Building", platform: "edureka", url: "https://www.youtube.com/watch?v=7u3S9V-tVAc", duration: "32:00" }
                ],
                quiz: {
                    title: "UI/UX Professional Quiz",
                    questions: [
                        { questionText: "What does UI stand for?", options: ["User Interface", "User Interaction", "Universal Integration", "User Instrument"], correctAnswer: "User Interface" },
                        { questionText: "Which tool is standard for modern UI design?", options: ["Photoshop", "Paint", "Figma", "Excel"], correctAnswer: "Figma" }
                    ]
                }
            }
        ];

        for (const data of topCourses) {
            // 3. Create Course
            const course = await Course.create({
                title: data.title,
                description: data.description,
                instructor: instructor._id,
                thumbnailUrl: data.thumbnailUrl,
                isPublished: true
            });

            // 4. Create Lessons (Content)
            const contentData = data.lessons.map((lesson, index) => ({
                course: course._id,
                title: lesson.title,
                type: "video",
                resourceUrl: lesson.url,
                platform: lesson.platform,
                thumbnailUrl: `https://img.youtube.com/vi/${lesson.url.split('v=')[1]?.split('&')[0]}/maxresdefault.jpg`,
                duration: lesson.duration,
                order: index + 1
            }));
            await Content.insertMany(contentData);

            // 5. Create Quiz
            await Quiz.create({
                course: course._id,
                title: data.quiz.title,
                questions: data.quiz.questions.map(q => ({
                    questionText: q.questionText,
                    options: q.options,
                    correctAnswer: q.correctAnswer
                }))
            });

            console.log(`Successfully seeded: ${course.title}`);
        }

        console.log("Premium Top 5 Courses Seeding Complete!");
        process.exit();
    } catch (error) {
        console.error("Premium Seeding Failed:", error);
        process.exit(1);
    }
};

seedTopCourses();
