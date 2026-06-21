import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import api from "../../api/axios";

const Analytics = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalCourses: 0,
        totalStudents: 0,
        totalInstructors: 0,
        totalAdmins: 0,
        publishedCourses: 0,
        unpublishedCourses: 0
    });
    const [loading, setLoading] = useState(true);
    const [rawData, setRawData] = useState({ users: [], courses: [] });
    const [activeMetric, setActiveMetric] = useState(null);
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                // Fetch users
                const usersRes = await api.get("/admin/users");
                const users = usersRes.data;

                // Fetch courses
                const coursesRes = await api.get("/courses");
                const courses = coursesRes.data;

                setRawData({ users, courses });

                // Calculate statistics
                const totalUsers = users.length;
                const totalStudents = users.filter(u => u.role === "student").length;
                const totalInstructors = users.filter(u => u.role === "instructor").length;
                const totalAdmins = users.filter(u => u.role === "admin").length;
                const totalCourses = courses.length;
                const publishedCourses = courses.filter(c => c.isPublished).length;
                const unpublishedCourses = courses.filter(c => !c.isPublished).length;

                setStats({
                    totalUsers,
                    totalCourses,
                    totalStudents,
                    totalInstructors,
                    totalAdmins,
                    publishedCourses,
                    unpublishedCourses
                });
            } catch (error) {
                console.error("Error fetching analytics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    const handleMetricClick = (metric, title) => {
        if (activeMetric?.id === metric) {
            setActiveMetric(null);
            setFilteredData([]);
            return;
        }

        let data = [];
        let type = "user";

        switch (metric) {
            case "totalUsers":
                data = rawData.users;
                break;
            case "students":
                data = rawData.users.filter(u => u.role === "student");
                break;
            case "instructors":
                data = rawData.users.filter(u => u.role === "instructor");
                break;
            case "admins":
                data = rawData.users.filter(u => u.role === "admin");
                break;
            case "totalCourses":
                data = rawData.courses;
                type = "course";
                break;
            case "published":
                data = rawData.courses.filter(c => c.isPublished);
                type = "course";
                break;
            case "unpublished":
                data = rawData.courses.filter(c => !c.isPublished);
                type = "course";
                break;
            default:
                data = [];
        }

        setActiveMetric({ id: metric, title, type });
        setFilteredData(data);

        // Small delay to ensure render then scroll
        setTimeout(() => {
            const element = document.getElementById("details-view");
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }, 100);
    };

    return (
        <AdminLayout>
            <div className="admin-header">
                <h2>📊 Analytics Dashboard</h2>
                <p>View platform statistics, user engagement, and course performance.</p>
            </div>

            {loading ? (
                <div className="empty-state">
                    <div className="empty-state-icon">⏳</div>
                    <h3>Loading analytics...</h3>
                </div>
            ) : (
                <>
                    {/* User Statistics */}
                    <div className="analytics-section">
                        <h3 className="section-title">👥 User Statistics</h3>
                        <div className="stats-grid">
                            <div
                                className={`stat-card clickable ${activeMetric?.id === "totalUsers" ? "active" : ""}`}
                                onClick={() => handleMetricClick("totalUsers", "All Registered Users")}
                            >
                                <div className="stat-icon">👨‍👩‍👧‍👦</div>
                                <div className="stat-value">{stats.totalUsers}</div>
                                <div className="stat-label">Total Users</div>
                            </div>
                            <div
                                className={`stat-card student clickable ${activeMetric?.id === "students" ? "active" : ""}`}
                                onClick={() => handleMetricClick("students", "Enrolled Students")}
                            >
                                <div className="stat-icon">🎓</div>
                                <div className="stat-value">{stats.totalStudents}</div>
                                <div className="stat-label">Students</div>
                            </div>
                            <div
                                className={`stat-card instructor clickable ${activeMetric?.id === "instructors" ? "active" : ""}`}
                                onClick={() => handleMetricClick("instructors", "Active Instructors")}
                            >
                                <div className="stat-icon">👨‍🏫</div>
                                <div className="stat-value">{stats.totalInstructors}</div>
                                <div className="stat-label">Instructors</div>
                            </div>
                            <div
                                className={`stat-card admin clickable ${activeMetric?.id === "admins" ? "active" : ""}`}
                                onClick={() => handleMetricClick("admins", "Platform Administrators")}
                            >
                                <div className="stat-icon">👑</div>
                                <div className="stat-value">{stats.totalAdmins}</div>
                                <div className="stat-label">Admins</div>
                            </div>
                        </div>
                    </div>

                    {/* Course Statistics */}
                    <div className="analytics-section">
                        <h3 className="section-title">📚 Course Statistics</h3>
                        <div className="stats-grid">
                            <div
                                className={`stat-card clickable ${activeMetric?.id === "totalCourses" ? "active" : ""}`}
                                onClick={() => handleMetricClick("totalCourses", "Total Courses Library")}
                            >
                                <div className="stat-icon">📖</div>
                                <div className="stat-value">{stats.totalCourses}</div>
                                <div className="stat-label">Total Courses</div>
                            </div>
                            <div
                                className={`stat-card published clickable ${activeMetric?.id === "published" ? "active" : ""}`}
                                onClick={() => handleMetricClick("published", "Published Courses")}
                            >
                                <div className="stat-icon">✅</div>
                                <div className="stat-value">{stats.publishedCourses}</div>
                                <div className="stat-label">Published</div>
                            </div>
                            <div
                                className={`stat-card unpublished clickable ${activeMetric?.id === "unpublished" ? "active" : ""}`}
                                onClick={() => handleMetricClick("unpublished", "Draft / Unpublished Courses")}
                            >
                                <div className="stat-icon">⏳</div>
                                <div className="stat-value">{stats.unpublishedCourses}</div>
                                <div className="stat-label">Unpublished</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">📊</div>
                                <div className="stat-value">
                                    {stats.totalCourses > 0
                                        ? Math.round((stats.publishedCourses / stats.totalCourses) * 100)
                                        : 0}%
                                </div>
                                <div className="stat-label">Publish Rate</div>
                            </div>
                        </div>
                    </div>

                    {/* DETAILS VIEW SECTION */}
                    {activeMetric && (
                        <div className="analytics-section details-view-container" id="details-view">
                            <div className="details-header">
                                <h3 className="section-title">🔍 Details: {activeMetric.title}</h3>
                                <button className="close-details-btn" onClick={() => setActiveMetric(null)}>✕ Close</button>
                            </div>

                            <div className="table-container">
                                <table className="admin-table">
                                    <thead>
                                        {activeMetric.type === "user" ? (
                                            <tr>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Role</th>
                                                <th>Joined</th>
                                            </tr>
                                        ) : (
                                            <tr>
                                                <th>Course Title</th>
                                                <th>Instructor</th>
                                                <th>Status</th>
                                                <th>Date Created</th>
                                            </tr>
                                        )}
                                    </thead>
                                    <tbody>
                                        {filteredData.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="text-center">No data found for this metric</td>
                                            </tr>
                                        ) : (
                                            filteredData.map((item) => (
                                                <tr key={item._id}>
                                                    {activeMetric.type === "user" ? (
                                                        <>
                                                            <td><strong>{item.name}</strong></td>
                                                            <td>{item.email}</td>
                                                            <td><span className={`role-badge ${item.role}`}>{item.role}</span></td>
                                                            <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <td><strong>{item.title}</strong></td>
                                                            <td>{item.instructor?.name || "System"}</td>
                                                            <td>
                                                                <span className={`status-badge ${item.isPublished ? "published" : "unpublished"}`}>
                                                                    {item.isPublished ? "Published" : "Draft"}
                                                                </span>
                                                            </td>
                                                            <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                                                        </>
                                                    )}
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Engagement Metrics */}
                    <div className="analytics-section">
                        <h3 className="section-title">📈 Engagement Metrics</h3>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon">👥</div>
                                <div className="stat-value">
                                    {stats.totalCourses > 0
                                        ? (stats.totalStudents / stats.totalCourses).toFixed(1)
                                        : 0}
                                </div>
                                <div className="stat-label">Avg Students/Course</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">📚</div>
                                <div className="stat-value">
                                    {stats.totalInstructors > 0
                                        ? (stats.totalCourses / stats.totalInstructors).toFixed(1)
                                        : 0}
                                </div>
                                <div className="stat-label">Avg Courses/Instructor</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">🎯</div>
                                <div className="stat-value">
                                    {stats.totalUsers > 0
                                        ? Math.round((stats.totalStudents / stats.totalUsers) * 100)
                                        : 0}%
                                </div>
                                <div className="stat-label">Student Ratio</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">⭐</div>
                                <div className="stat-value">
                                    {stats.totalUsers > 0
                                        ? Math.round((stats.totalInstructors / stats.totalUsers) * 100)
                                        : 0}%
                                </div>
                                <div className="stat-label">Instructor Ratio</div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </AdminLayout>
    );
};

export default Analytics;
