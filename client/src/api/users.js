import apiClient from "./client";

export const getProfile = async () => {
  const { data } = await apiClient.get("/users/profile");
  return data.user;
};

export const updateProfile = async (profileData) => {
  const { data } = await apiClient.patch("/users/profile", profileData);
  return data.user;
};

export const changePassword = async (currentPassword, newPassword) => {
  const { data } = await apiClient.post("/users/change-password", {
    currentPassword,
    newPassword,
  });
  return data;
};
