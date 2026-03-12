import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import PageWrapper from "../components/layout/PageWrapper";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import MatchResultsPage from "../pages/MatchResultsPage";
import JobsPage from "../pages/JobsPage";

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page has its own nav + footer */}
        <Route path="/" element={<LandingPage />} />

        {/* All other pages use shared layout */}
        <Route
          path="*"
          element={
            <PageWrapper>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/jobs" element={<JobsPage />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/results"
                  element={
                    <ProtectedRoute>
                      <MatchResultsPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </PageWrapper>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
