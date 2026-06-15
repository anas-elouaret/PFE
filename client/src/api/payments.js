import apiClient from "./client";

export const createInvoice = async (items, total, email) => {
  const { data } = await apiClient.post("/orders", {
    items,
    total,
    email,
    clientName: email,
    subtotal: total,
    status: "pending",
    paymentStatus: "pending",
  });
  return data.order;
};

export const processPayment = async (invoiceId) => {
  const { data } = await apiClient.patch(`/orders/${invoiceId}/status`, {
    paymentStatus: "paid",
  });
  return data.order;
};

export const getInvoices = async () => {
  const { data } = await apiClient.get("/orders/my");
  return data.orders;
};

export const getInvoiceById = async (id) => {
  const { data } = await apiClient.get(`/orders/${id}`);
  return data.order;
};
