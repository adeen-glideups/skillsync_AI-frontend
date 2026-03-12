import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { loginUser, registerUser, logoutUser, getCurrentUser } from "../api/auth.api";

export function useAuth() {
  const navigate = useNavigate();
  const { user, isAuthenticated, setAuth, clearAuth, setUser } = useAuthStore();

  const login = useCallback(
    async (credentials) => {
      const { data } = await loginUser(credentials);
      setAuth(data.user, data.token);
      navigate("/dashboard");
    },
    [setAuth, navigate]
  );

  const register = useCallback(
    async (formData) => {
      const { data } = await registerUser(formData);
      setAuth(data.user, data.token);
      navigate("/dashboard");
    },
    [setAuth, navigate]
  );

  const logout = useCallback(async () => {
    await logoutUser().catch(() => {});
    clearAuth();
    navigate("/login");
  }, [clearAuth, navigate]);

  const fetchUser = useCallback(async () => {
    const { data } = await getCurrentUser();
    setUser(data.user);
  }, [setUser]);

  return { user, isAuthenticated, login, register, logout, fetchUser };
}
