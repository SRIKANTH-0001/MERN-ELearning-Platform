import api from "./axios";

export const getStudentDashboardStats = async () => {
    const response = await api.get("/student/dashboard/stats");
    return response.data;
};
