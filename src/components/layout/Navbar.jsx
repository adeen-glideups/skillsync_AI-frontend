import { Link } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import Button from "../ui/Button";

export default function Navbar() {
  const { isAuthenticated, clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
  };

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-bold text-blue-600">
          SkillSync
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/jobs" className="text-sm text-gray-600 hover:text-gray-900">
            Jobs
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <Button variant="ghost" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
