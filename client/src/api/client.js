import axios from "axios";
import { normalizeId } from "../utils/normalize";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const BASE_URL = API_BASE.endsWith("/api") ? API_BASE : `${API_BASE.replace(/\/+$/, "")}/api`;

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  timeout: 30000,
});

apiClient.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("client_token") || sessionStorage.getItem("client_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    if (response.data) {
      response.data = normalizeId(response.data);
    }
    return response;
  },
  (error) => {
    if (error.code === "ERR_NETWORK" || error.response?.status === 502) {
      return Promise.resolve({ data: { projects: [], messages: [], reviews: [], services: [] } });
    }
    if (error.response) {
      const message =
        error.response.data?.message || `Server error (${error.response.status})`;
      if (error.response.status === 401) {
        const isAuthPage = window.location.pathname.includes("/auth") || window.location.pathname.includes("/login");
        if (!isAuthPage) {
          localStorage.removeItem("client_token");
          localStorage.removeItem("client_user");
          sessionStorage.removeItem("client_token");
          sessionStorage.removeItem("client_user");
        }
      }
      return Promise.reject(new Error(message));
    }
    return Promise.reject(new Error("An unexpected error occurred"));
  }
);

export default apiClient;
