const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Course = require("../models/Course");

dotenv.config();

const checkCourses = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const courses = await Course.find({}, "title thumbnailUrl");
        console.log("Current Courses in DB:");
        console.log(JSON.stringify(courses, null, 2));
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkCourses();
