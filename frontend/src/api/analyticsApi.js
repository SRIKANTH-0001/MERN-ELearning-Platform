import api from "./axios";

export const getPlatformAnalytics = async () => {
  const response = await api.get("/analytics");
  return response.data;
};
