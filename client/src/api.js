import axios from "axios";

// ✅ Your live backend URL from Render
const API_BASE_URL = "https://kidovate-9-1.onrender.com";

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Example API calls
export const login = (data) => api.post("/auth/login", data);
export const register = (data) => api.post("/auth/register", data);
export const getHealth = () => api.get("/health");
