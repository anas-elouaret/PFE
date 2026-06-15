import apiClient from "./client";

export const getProjects = async (params = {}) => {
  const { data } = await apiClient.get("/projects", { params });
  return data.projects;
};

export const getMyProjects = async () => {
  const { data } = await apiClient.get("/projects/my");
  return data.projects;
};

export const getProjectById = async (id) => {
  const { data } = await apiClient.get(`/projects/${id}`);
  return data.project;
};

export const createProject = async (projectData) => {
  const { data } = await apiClient.post("/projects", projectData);
  return data.project;
};

export const updateProject = async (id, updates) => {
  const { data } = await apiClient.patch(`/projects/${id}`, updates);
  return data.project;
};

export const updateProjectStatus = async (id, status, note) => {
  const { data } = await apiClient.patch(`/projects/${id}/status`, { status, note });
  return data.project;
};

export const deleteProject = async (id) => {
  const { data } = await apiClient.delete(`/projects/${id}`);
  return data;
};
