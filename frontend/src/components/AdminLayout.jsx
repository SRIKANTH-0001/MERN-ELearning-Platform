import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import ProtectedRoute from "./ProtectedRoute";
import "../styles/admin.css";

const AdminLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <ProtectedRoute roles={["admin"]}>
            <div className={`admin-layout ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
                <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

                <main className="admin-main-content">
                    <button className="menu-toggle-btn" onClick={toggleSidebar}>
                        {isSidebarOpen ? "◀" : "☰"}
                    </button>

                    {children}
                </main>
            </div>
        </ProtectedRoute>
    );
};

export default AdminLayout;
