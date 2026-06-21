import React, { useState } from "react";
import InstructorLayout from "../../components/InstructorLayout";
import { createCourse } from "../../api/courseApi";

const CreateCourse = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCourse({ title, description });
      setMessage("Course created successfully!");
      setTitle("");
      setDescription("");
    } catch (error) {
      setMessage("Failed to create course. Please try again.");
    }
  };

  return (
    <InstructorLayout>
      <div className="instructor-header">
        <h2>Create New Course</h2>
        <p>Design a new course for students to enroll in.</p>
      </div>

      <form onSubmit={handleSubmit} className="instructor-form">
        <div className="form-group">
          <label className="form-label">Course Title</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g., Advanced JavaScript Programming"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Course Description</label>
          <textarea
            className="form-textarea"
            placeholder="Describe what students will learn in this course..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Create Course
        </button>

        {message && (
          <div className={message.includes("success") ? "success-message" : "error-message"}>
            {message}
          </div>
        )}
      </form>
    </InstructorLayout>
  );
};

export default CreateCourse;
