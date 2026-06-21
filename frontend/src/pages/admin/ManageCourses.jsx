import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { getAllCourses } from "../../api/courseApi";

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getAllCourses();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <AdminLayout>
      <div className="admin-header">
        <h2>Manage Courses</h2>
        <p>Oversee all courses and their publication status.</p>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="empty-state">
            <div className="empty-state-icon">⏳</div>
            <h3>Loading courses...</h3>
          </div>
        ) : courses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📚</div>
            <h3>No Courses Found</h3>
            <p>There are no courses created yet.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Instructor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course._id}>
                  <td>{course.title}</td>
                  <td>{course.description || "No description"}</td>
                  <td>{course.instructor?.name || "N/A"}</td>
                  <td>
                    <span className={`status-badge ${course.isPublished ? "published" : "unpublished"}`}>
                      {course.isPublished ? "Published" : "Unpublished"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageCourses;
