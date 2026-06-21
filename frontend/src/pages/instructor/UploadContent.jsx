import React, { useState } from "react";
import InstructorLayout from "../../components/InstructorLayout";
import { uploadContent } from "../../api/contentApi";

const UploadContent = () => {
  const [courseId, setCourseId] = useState("");
  const [contentType, setContentType] = useState("video");
  const [contentUrl, setContentUrl] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await uploadContent({ courseId, contentType, contentUrl });
      setMessage("Content uploaded successfully!");
      setCourseId("");
      setContentUrl("");
    } catch (error) {
      setMessage("Failed to upload content. Please try again.");
    }
  };

  return (
    <InstructorLayout>
      <div className="instructor-header">
        <h2>Upload Content</h2>
        <p>Add videos, PDFs, or external links to your courses.</p>
      </div>

      <form onSubmit={handleSubmit} className="instructor-form">
        <div className="form-group">
          <label className="form-label">Course ID</label>
          <input
            type="text"
            className="form-input"
            placeholder="Enter the course ID"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Content Type</label>
          <select
            className="form-select"
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
          >
            <option value="video">Video</option>
            <option value="pdf">PDF</option>
            <option value="link">External Link</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Content URL</label>
          <input
            type="url"
            className="form-input"
            placeholder="https://example.com/content"
            value={contentUrl}
            onChange={(e) => setContentUrl(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Upload Content
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

export default UploadContent;
