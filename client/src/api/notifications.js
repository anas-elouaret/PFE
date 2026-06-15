import apiClient from "./client";

export const getNotifications = async () => {
  try {
    const { data } = await apiClient.get("/contact");
    const messages = data.messages || [];
    return messages.map((msg) => ({
      id: msg._id,
      title: msg.subject,
      message: msg.message,
      read: msg.isRead,
      createdAt: msg.createdAt,
    }));
  } catch {
    return [];
  }
};

export const addNotification = async (notification) => {
  return { id: "local_" + Date.now(), read: false, ...notification };
};

export const markAsRead = async (id) => {
  try {
    await apiClient.patch(`/contact/${id}/read`);
  } catch {}
  return { id, read: true };
};

export const markAllAsRead = async () => {
  return [];
};

export const clearNotifications = async () => {
  return [];
};

export const getUnreadCount = async () => {
  try {
    const { data } = await apiClient.get("/contact");
    return (data.messages || []).filter((m) => !m.isRead).length;
  } catch {
    return 0;
  }
};
