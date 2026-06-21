import React, { useState, useEffect } from "react";
import StudentLayout from "../../components/StudentLayout";
import CertificateViewer from "../../components/CertificateViewer";
import { useAuth } from "../../context/AuthContext";
import { getMyEnrolledCourses } from "../../api/courseApi";
import { toast } from "react-toastify";

const CertificatePage = () => {
  const { user } = useAuth();
  const [formName, setFormName] = useState("");
  const [formCourse, setFormCourse] = useState("");
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [certificateId] = useState(`CERT-${Date.now().toString().slice(-6)}`);

  const [formProfession, setFormProfession] = useState("Full Stack Developer");

  useEffect(() => {
    if (user && !formName) setFormName(user.name);
  }, [user, formName]);

  const fetchCourses = async () => {
    try {
      const courses = await getMyEnrolledCourses();
      console.log("Enrolled Courses:", courses);
      setEnrolledCourses(courses);
      if (courses.length > 0) {
        setFormCourse(courses[0].title);
      } else {
        toast.info("No enrolled courses found. Please enroll in a course first.");
      }
    } catch (err) {
      console.error("Failed to fetch enrolled courses", err);
      toast.error("Failed to load your course list.");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleGenerate = (e) => {
    e.preventDefault();
  };

  return (
    <StudentLayout>
      <div className="student-header">
        <h2>Generate Your Certificate</h2>
        <p>Verify your details and download your official certificate of completion.</p>
      </div>

      <div className="certificate-editor-grid" style={styles.grid}>
        <div className="glass-card" style={styles.formCard}>
          <h3>Certificate Details</h3>
          <form onSubmit={handleGenerate} style={styles.form}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={styles.inputGroup}>
                <label>Full Name on Certificate</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Enter your full name"
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label>Profession/Title</label>
                <input
                  type="text"
                  value={formProfession}
                  onChange={(e) => setFormProfession(e.target.value)}
                  placeholder="e.g. Software Engineer"
                  style={styles.input}
                  required
                />
              </div>
            </div>
            <div style={styles.inputGroup}>
              <label style={{ color: '#fff', fontWeight: '500' }}>Select Course</label>
              <select
                value={formCourse}
                onChange={(e) => setFormCourse(e.target.value)}
                style={styles.input}
              >
                {enrolledCourses.length > 0 ? (
                  <>
                    <option value="" disabled>-- Select a Completed Course --</option>
                    {enrolledCourses.map(c => (
                      <option key={c._id} value={c.title}>{c.title}</option>
                    ))}
                  </>
                ) : (
                  <option value="">No courses found. Enroll first.</option>
                )}
              </select>
            </div>
          </form>
        </div>

        <div className="glass-card" style={styles.viewerCard}>
          <CertificateViewer
            studentName={formName || "Student Name"}
            studentProfession={formProfession || "Full Stack Developer"}
            courseTitle={formCourse || "Select a Course"}
            certificateId={certificateId}
          />
        </div>
      </div>
    </StudentLayout>
  );
};

const styles = {
  grid: {
    display: "flex",
    flexDirection: "column",
    gap: "30px",
    marginTop: "20px",
  },
  formCard: {
    padding: "30px",
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  viewerCard: {
    padding: "40px",
    overflowX: "auto",
    display: "flex",
    justifyContent: "center",
    background: "rgba(15, 23, 42, 0.4)",
    borderRadius: "24px",
    border: "1px solid rgba(255,255,255,0.05)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    marginTop: "15px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,1)", // Pure white background
    fontSize: "14px",
    color: "#0f172a", // Dark text color for visibility
    fontWeight: '600',
    outline: 'none',
  },
  btn: {
    marginTop: "10px",
    padding: "12px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  }
};

export default CertificatePage;
