import API from "./api";

export const register = (formData) => API.post("/auth/register", formData);
export const login = (formData) => API.post("/auth/login", formData);
export const getUsers = () => API.get("/auth/users");
