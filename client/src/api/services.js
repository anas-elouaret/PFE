import apiClient from "./client";

export const getServices = async (params = {}) => {
  const { data } = await apiClient.get("/services", { params });
  return data.services;
};

export const getServiceById = async (id) => {
  const { data } = await apiClient.get(`/services/${id}`);
  return data.service;
};

export const createService = async (serviceData) => {
  const { data } = await apiClient.post("/services", serviceData);
  return data.service;
};

export const updateService = async (id, updates) => {
  const { data } = await apiClient.patch(`/services/${id}`, updates);
  return data.service;
};

export const deleteService = async (id) => {
  const { data } = await apiClient.delete(`/services/${id}`);
  return data;
};
