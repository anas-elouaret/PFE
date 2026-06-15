import apiClient from "./client";

export const signup = async ({ name, email, password }) => {
  const { data } = await apiClient.post("/auth/signup", { name, email, password });
  return data;
};

export const signin = async ({ email, password }) => {
  const { data } = await apiClient.post("/auth/signin", { email, password });
  return data;
};

export const logout = async () => {
  const { data } = await apiClient.post("/auth/logout");
  return data;
};

export const getCurrentUser = async () => {
  const { data } = await apiClient.get("/auth/me");
  return data;
};

export const verifyEmail = async (token) => {
  const { data } = await apiClient.get(`/auth/verify-email?token=${token}`);
  return data;
};

export const resendVerification = async (email) => {
  const { data } = await apiClient.post("/auth/resend-verification", { email });
  return data;
};

export const forgotPassword = async (email) => {
  const { data } = await apiClient.post("/auth/forgot-password", { email });
  return data;
};

export const resetPassword = async (token, password) => {
  const { data } = await apiClient.post("/auth/reset-password", { token, password });
  return data;
};
