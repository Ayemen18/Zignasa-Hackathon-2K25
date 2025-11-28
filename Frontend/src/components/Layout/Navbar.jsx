import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

export default function Navbar() {
  const navigate = useNavigate();

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="w-full bg-white shadow-sm px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <div
        onClick={() => navigate(isAuthenticated ? "/home" : "/login")}
        className="text-xl font-semibold cursor-pointer"
      >
        LearnAI
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {!isAuthenticated && (
          <>
            <Link
              to="/login"
              className="text-gray-700 hover:text-blue-600 text-sm"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700"
            >
              Sign Up
            </Link>
          </>
        )}

        {isAuthenticated && (
          <>
            {/* Show username if available, else fallback to email */}
            <span className="text-sm text-gray-600">
              {user?.username ? `${user.username}` : user?.email}
            </span>

            <button
              onClick={handleLogout}
              className="text-sm bg-red-500 text-white px-3 py-1.5 rounded-md hover:bg-red-600"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
