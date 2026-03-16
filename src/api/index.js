import axios from "axios";
import useAuthStore from "../store/authStore";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

// Attach auth token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Flag to prevent multiple simultaneous refresh calls
let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

// Extract a safe user-facing message from any error
function safeErrorMessage(error, fallback = "Something went wrong") {
  if (error.response) {
    const d = error.response.data;
    // Server returned JSON with a message field
    if (d && typeof d === "object" && d.message) return d.message;
    // Map status codes to friendly messages
    if (error.response.status === 401) return "Invalid credentials";
    if (error.response.status === 403) return "Access denied";
    if (error.response.status === 404) return "Not found";
    if (error.response.status === 429) return "Too many requests — try again later";
    if (error.response.status >= 500) return "Server error — try again later";
  }
  if (error.code === "ECONNABORTED") return "Request timed out";
  if (!error.response && error.request) return "Network error — check connection";
  return fallback;
}

// Response interceptor with token refresh logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and we haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't try to refresh if the failed request was itself a refresh or login/signup
      const url = originalRequest.url || "";
      if (
        url.includes("/auth/refresh-token") ||
        url.includes("/auth/login") ||
        url.includes("/auth/signup")
      ) {
        // Normalize the error before passing to caller
        const msg = safeErrorMessage(error, "Invalid email or password");
        const normalized = new Error(msg);
        normalized.response = error.response;
        return Promise.reject(normalized);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        forceLogout();
        return Promise.reject(new Error("Session expired"));
      }

      try {
        const { data } = await axios.post(
          `${API_BASE}/auth/refresh-token`,
          { refreshToken }
        );

        const payload = data?.data || data;
        const newAccessToken = payload?.accessToken;
        const newRefreshToken = payload?.refreshToken;

        if (!newAccessToken) {
          throw new Error("No access token in refresh response");
        }

        localStorage.setItem("accessToken", newAccessToken);
        if (newRefreshToken) localStorage.setItem("refreshToken", newRefreshToken);

        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        forceLogout();
        return Promise.reject(new Error("Session expired — please log in again"));
      } finally {
        isRefreshing = false;
      }
    }

    // For all other errors, normalize the message
    const msg = safeErrorMessage(error);
    const normalized = new Error(msg);
    normalized.response = error.response;
    normalized.request = error.request;
    return Promise.reject(normalized);
  }
);

function forceLogout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  // Also clear Zustand store so ProtectedRoute reacts immediately
  useAuthStore.getState().clearAuth();
  window.location.href = "/login";
}

export default api;
