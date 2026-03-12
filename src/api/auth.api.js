import api from "./index";

export const loginUser = (credentials) => api.post("/auth/login", credentials);

export const registerUser = (data) => api.post("/auth/register", data);

export const logoutUser = () => api.post("/auth/logout");

export const getCurrentUser = () => api.get("/auth/me");
