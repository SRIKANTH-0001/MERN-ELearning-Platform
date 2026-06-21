import React, { useState } from "react";
import StudentSidebar from "./StudentSidebar";
import ProtectedRoute from "./ProtectedRoute";
import "../styles/student.css";

const StudentLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <ProtectedRoute roles={["student"]}>
            <div className={`student-layout ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
                <StudentSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

                <main className="student-main-content">
                    <button className="menu-toggle-btn" onClick={toggleSidebar}>
                        {isSidebarOpen ? "◀" : "☰"}
                    </button>

                    {children}
                </main>
            </div>
        </ProtectedRoute>
    );
};

export default StudentLayout;
