import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const API = axios.create({
  baseURL: BASE,
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("parking_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;