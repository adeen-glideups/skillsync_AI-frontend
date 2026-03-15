import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardLayout from "../components/layout/DashboardLayout";
import DashHomePage from "../pages/dashboard/DashHomePage";
import DashUploadPage from "../pages/dashboard/DashUploadPage";
import DashMatchesPage from "../pages/dashboard/DashMatchesPage";
import DashJobsPage from "../pages/dashboard/DashJobsPage";
import DashJobDetailPage from "../pages/dashboard/DashJobDetailPage";
import DashProfilePage from "../pages/dashboard/DashProfilePage";
import DashApplicationsPage from "../pages/dashboard/DashApplicationsPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";

function ProtectedRoute({ children }) {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page — own layout */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth pages — own layout (two-panel) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Dashboard — sidebar layout with nested pages */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashHomePage />} />
          <Route path="upload" element={<DashUploadPage />} />
          <Route path="matches" element={<DashMatchesPage />} />
          <Route path="jobs" element={<DashJobsPage />} />
          <Route path="jobs/:jobId" element={<DashJobDetailPage />} />
          <Route path="profile" element={<DashProfilePage />} />
          <Route path="applications" element={<DashApplicationsPage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
