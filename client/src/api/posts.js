import apiClient from "./client";

/** The community feed, shared by everyone. Readable without an account. */
export const getFeed = async ({ page = 1, limit = 20 } = {}) => {
  const { data } = await apiClient.get("/posts", { params: { page, limit } });
  return data;
};

export const createPost = async ({ text, image, video }) => {
  const { data } = await apiClient.post("/posts", { text, image, video });
  return data.post;
};

export const updatePost = async (id, { text, image, video }) => {
  const { data } = await apiClient.patch(`/posts/${id}`, { text, image, video });
  return data.post;
};

export const deletePost = async (id) => {
  const { data } = await apiClient.delete(`/posts/${id}`);
  return data;
};

export const toggleLike = async (id) => {
  const { data } = await apiClient.post(`/posts/${id}/like`);
  return data;
};

export const addComment = async (id, text) => {
  const { data } = await apiClient.post(`/posts/${id}/comments`, { text });
  return data.post;
};

export const deleteComment = async (id, commentId) => {
  const { data } = await apiClient.delete(`/posts/${id}/comments/${commentId}`);
  return data.post;
};
