import api from "./axios";

export const getStudentProgress = async () => {
  const response = await api.get("/progress");
  return response.data;
};
