import apiClient from "../api/client";

export async function submitReview(data) {
  const { data: response } = await apiClient.post("/reviews", data);
  return response;
}

export async function getApprovedReviews({ page = 1, limit = 20, sort = "newest" } = {}) {
  const { data } = await apiClient.get("/reviews", { params: { page, limit, sort } });
  return data;
}

export async function likeReview(id) {
  const { data } = await apiClient.post(`/reviews/${id}/like`);
  return data;
}

export async function getAllReviews({ status = "all", search = "" } = {}) {
  const { data } = await apiClient.get("/reviews/admin", { params: { status, search } });
  return data;
}

export async function updateReviewStatus(id, status) {
  const { data } = await apiClient.patch(`/reviews/admin/${id}`, { status });
  return data;
}

export async function deleteReview(id) {
  const { data } = await apiClient.delete(`/reviews/admin/${id}`);
  return data;
}
