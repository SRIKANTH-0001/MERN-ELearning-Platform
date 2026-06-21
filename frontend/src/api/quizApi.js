import api from "./axios";

export const createQuiz = async (quizData) => {
  const response = await api.post("/quiz", quizData);
  return response.data;
};

export const submitQuiz = async (submissionData) => {
  const response = await api.post("/quiz/submit", submissionData);
  return response.data;
};

export const getQuizByCourse = async (courseId) => {
  const response = await api.get(`/quiz/course/${courseId}`);
  return response.data;
};

export const generateAIQuiz = async (courseId) => {
  const response = await api.post("/quiz/generate-ai", { courseId });
  return response.data;
};
