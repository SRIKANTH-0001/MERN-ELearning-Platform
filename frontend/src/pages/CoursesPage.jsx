import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getAllCourses, enrollInCourse } from "../api/courseApi";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "../styles/courses.css";

const CoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await getAllCourses();
                const normalized = data.map((course) => ({
                    ...course,
                    isEnrolled: user && course.studentsEnrolled?.some((id) => id.toString() === user._id),
                }));
                setCourses(normalized);
            } catch (error) {
                console.error("Error fetching courses:", error);
                toast.error("Failed to load courses. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [user]);

    const handleEnroll = async (courseId) => {
        const course = courses.find((course) => course._id === courseId);
        if (course?.isEnrolled) {
            return;
        }

        if (!isAuthenticated) {
            toast.info("Please login to enroll in courses.");
            navigate("/login");
            return;
        }

        try {
            await enrollInCourse(courseId);
            setCourses((prevCourses) =>
                prevCourses.map((course) =>
                    course._id === courseId ? { ...course, isEnrolled: true } : course
                )
            );
            toast.success("Successfully enrolled!");
            navigate(`/student/course-player/${courseId}`);
        } catch (error) {
            console.error("Enrollment error:", error);
            toast.error("Enrollment failed. You might already be enrolled.");
            navigate(`/student/course-player/${courseId}`);
        }
    };

    if (loading) return (
        <div>
            <Navbar />
            <div className="courses-loading">Loading amazing courses...</div>
            <Footer />
        </div>
    );

    return (
        <div>
            <Navbar />

            <div className="courses-page">
                <div className="courses-header">
                    <h1>Explore All Courses</h1>
                    <p>Choose from our comprehensive catalog of courses designed by industry experts</p>
                </div>

                <div className="courses-container">
                    {courses.map((course) => (
                        <div
                            key={course._id}
                            className="public-course-card"
                            onClick={() => navigate(`/student/course-player/${course._id}`)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="public-course-thumbnail">
                                <img src={course.thumbnailUrl || "/ai_ml_course.png"} alt={course.title} />
                                <div className="course-badge">{course.level || "Beginner"}</div>
                            </div>

                            <div className="public-course-content">
                                <h3>{course.title}</h3>
                                <p className="course-desc">
                                    {course.description.length > 120
                                        ? `${course.description.substring(0, 120)}...`
                                        : course.description}
                                </p>

                                <div className="course-instructor">
                                    <span className="icon">👨‍🏫</span>
                                    <span>{course.instructor?.name || "Expert Instructor"}</span>
                                </div>

                                <div className="course-stats">
                                    <div className="stat">
                                        <span className="icon">⏱️</span>
                                        <span>{course.duration || "10 Weeks"}</span>
                                    </div>
                                    <div className="stat">
                                        <span className="icon">👥</span>
                                        <span>{course.studentsEnrolled?.length || 0} students</span>
                                    </div>
                                    <div className="stat">
                                        <span className="icon">⭐</span>
                                        <span>{course.rating || "4.8"}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEnroll(course._id);
                                    }}
                                    className="enroll-now-btn"
                                    disabled={course.isEnrolled}
                                >
                                    {course.isEnrolled ? "Enrolled" : "Enroll Now"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default CoursesPage;
