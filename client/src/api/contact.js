import apiClient from "./client";

export const submitContact = async (contactData) => {
  const { data } = await apiClient.post("/contact", contactData);
  return data;
};

export const getAllMessages = async () => {
  const { data } = await apiClient.get("/contact");
  return data;
};

export const markMessageAsRead = async (id) => {
  const { data } = await apiClient.patch(`/contact/${id}/read`);
  return data;
};

export const deleteMessage = async (id) => {
  const { data } = await apiClient.delete(`/contact/${id}`);
  return data;
};
