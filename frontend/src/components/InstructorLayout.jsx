import React, { useState } from "react";
import InstructorSidebar from "./InstructorSidebar";
import ProtectedRoute from "./ProtectedRoute";
import "../styles/instructor.css";

const InstructorLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <ProtectedRoute roles={["instructor"]}>
            <div className={`instructor-layout ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
                <InstructorSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

                <main className="instructor-main-content">
                    <button className="menu-toggle-btn" onClick={toggleSidebar}>
                        {isSidebarOpen ? "◀" : "☰"}
                    </button>

                    {children}
                </main>
            </div>
        </ProtectedRoute>
    );
};

export default InstructorLayout;
