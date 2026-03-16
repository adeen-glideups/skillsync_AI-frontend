import api from "./index";

// 1.1 Signup (multipart/form-data)
export const signup = (formData) =>
  api.post("/auth/signup", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// 1.2 Login
export const login = ({ email, password, deviceType, fcmToken }) =>
  api.post("/auth/login", { email, password, deviceType, fcmToken });

// 1.3 Firebase Social Login
export const socialLogin = (firebaseToken) =>
  api.post("/auth/join", { firebaseToken });

// 1.4 Request OTP
export const requestOtp = (email, purpose) =>
  api.post("/auth/request-otp", { email, purpose });

// 1.5 Verify OTP
export const verifyOtp = ({ email, otp, purpose }) =>
  api.post("/auth/verify-otp", { email, otp, purpose });

// 1.6 Forgot Password - Request OTP
export const forgotPasswordRequestOtp = (email) =>
  api.post("/auth/forgot-password-request-otp", { email });

// 1.7 Update Password (Auth required) — for profile/settings
export const updatePassword = ({ oldPassword, newPassword }) =>
  api.post("/auth/update-password", { oldPassword, newPassword });

// 1.7b Reset Password (Auth required) — for forgot-password flow
export const resetPassword = (password) =>
  api.post("/auth/reset-password", { password });

// 1.8 Refresh Token
export const refreshToken = (token) =>
  api.post("/auth/refresh-token", { refreshToken: token });

// 1.9 Logout single device
export const logout = () => {
  const rt = localStorage.getItem("refreshToken");
  return api.post("/auth/logout", { refreshToken: rt });
};

// 1.10 Logout all devices (Auth required)
export const logoutAll = () => api.post("/auth/logout-all");

// 1.11 Update Profile (multipart/form-data, Auth required)
export const updateProfile = (formData) =>
  api.post("/auth/update-profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// 1.12 Get Profile (Auth required)
export const getProfile = () => api.get("/auth/profile");
