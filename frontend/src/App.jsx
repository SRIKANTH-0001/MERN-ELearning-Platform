import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import LandingPage from "./pages/LandingPage";
import CoursesPage from "./pages/CoursesPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageCourses from "./pages/admin/ManageCourses";
import Analytics from "./pages/admin/Analytics";
import StudentDashboard from "./pages/student/StudentDashboard";
import EnrolledCourses from "./pages/student/EnrolledCourses";
import CoursePlayer from "./pages/student/CoursePlayer";
import AttemptQuiz from "./pages/student/AttemptQuiz";
import ProgressPage from "./pages/student/ProgressPage";
import CertificatePage from "./pages/student/CertificatePage";

import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import CreateCourse from "./pages/instructor/CreateCourse";
import UploadContent from "./pages/instructor/UploadContent";
import CreateQuiz from "./pages/instructor/CreateQuiz";
import ChatWidget from "./components/Chat/ChatWidget";

const App = () => {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/courses" element={<ManageCourses />} />
        <Route path="/admin/analytics" element={<Analytics />} />
        <Route path="/instructor" element={<InstructorDashboard />} />
        <Route path="/instructor/create-course" element={<CreateCourse />} />
        <Route path="/instructor/upload-content" element={<UploadContent />} />
        <Route path="/instructor/create-quiz" element={<CreateQuiz />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/courses" element={<EnrolledCourses />} />
        <Route path="/student/course-player/:courseId" element={<CoursePlayer />} />
        <Route path="/student/quiz" element={<AttemptQuiz />} />
        <Route path="/student/progress" element={<ProgressPage />} />
        <Route path="/student/certificates" element={<CertificatePage />} />

      </Routes>
      <ChatWidget />
    </>
  );
};

export default App;
