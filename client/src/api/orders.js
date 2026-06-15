import apiClient from "./client";

export const createOrder = async (orderData) => {
  const { data } = await apiClient.post("/orders", orderData);
  return data.order;
};

export const getMyOrders = async () => {
  const { data } = await apiClient.get("/orders/my");
  return data.orders;
};

export const getOrderById = async (id) => {
  const { data } = await apiClient.get(`/orders/${id}`);
  return data.order;
};

export const getAllOrders = async (params = {}) => {
  const { data } = await apiClient.get("/orders", { params });
  return data.orders;
};

export const updateOrderStatus = async (id, updates) => {
  const { data } = await apiClient.patch(`/orders/${id}/status`, updates);
  return data.order;
};
