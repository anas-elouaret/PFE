import apiClient from "./client";

/** A guide's questions. The answer key stays on the server. */
export const getQuiz = async (slug) => {
  const { data } = await apiClient.get(`/quizzes/${slug}`);
  return data;
};

/**
 * Submits answers for grading.
 * @param {string} slug
 * @param {Record<string, number>} answers question id → chosen option index
 */
export const submitQuiz = async (slug, answers) => {
  const { data } = await apiClient.post(`/quizzes/${slug}/attempts`, { answers });
  return data;
};

/** The signed-in reader's own attempts and their best score per guide. */
export const getMyAttempts = async () => {
  const { data } = await apiClient.get("/quizzes/me/attempts");
  return data;
};
