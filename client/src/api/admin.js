import apiClient from "./client";

export const getDashboardStats = async () => {
  const { data } = await apiClient.get("/admin/dashboard");
  return data;
};

export const getAnalytics = async () => {
  const { data } = await apiClient.get("/admin/analytics");
  return data;
};

export const getAllUsers = async () => {
  const { data } = await apiClient.get("/users/admin/all");
  return data.users;
};

export const updateUserRole = async (userId, role) => {
  const { data } = await apiClient.patch(`/users/admin/${userId}/role`, { role });
  return data.user;
};
