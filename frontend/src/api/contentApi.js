import api from "./axios";

export const uploadContent = async (contentData) => {
    const response = await api.post("/content", contentData);
    return response.data;
};

export const getContentByCourse = async (courseId) => {
    const response = await api.get(`/content/${courseId}`);
    return response.data;
};

export const markContentCompleted = async (contentId) => {
    const response = await api.post(`/content/complete/${contentId}`);
    return response.data;
};
