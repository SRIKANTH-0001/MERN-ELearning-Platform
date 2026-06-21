import api from "./axios";

export const getAllCourses = async () => {
  const response = await api.get("/courses");
  return response.data;
};

export const createCourse = async (courseData) => {
  const response = await api.post("/courses", courseData);
  return response.data;
};

export const enrollInCourse = async (courseId) => {
  const response = await api.post(`/courses/enroll/${courseId}`);
  return response.data;
};

export const getMyEnrolledCourses = async () => {
  const response = await api.get("/courses/enrolled");
  return response.data;
};

export const getCourseById = async (courseId) => {
  const response = await api.get(`/courses/${courseId}`);
  return response.data;
};
