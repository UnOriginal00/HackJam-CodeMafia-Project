import axios from "axios";

// Default to Vite env var VITE_API_BASE, fallback to local backend URL used in project.
const api = axios.create({
  baseURL: import.meta.env?.VITE_API_BASE || "https://localhost:7122/api",
  headers: { "Content-Type": "application/json" },
});

// Attach token stored under 'jwt' (keeps existing behaviour).
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt"); // in production prefer httpOnly cookie
  if (token && config && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;