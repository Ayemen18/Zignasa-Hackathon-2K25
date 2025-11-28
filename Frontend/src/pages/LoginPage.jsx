import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import useAuthStore from "../store/authStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const loginStore = useAuthStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      // Try real backend login first (if your backend is ready)
      const res = await axios.post(
        import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/auth/login` : "/api/auth/login",
        { email, password },
        { timeout: 10000 }
      );

      // Expect backend to return { user: {...}, token: "..." } or similar.
      const userData = res?.data?.user ?? { email };
      // Save minimal user data in auth store (expand as backend becomes ready)
      loginStore(userData);

      // Redirect to home
      navigate("/home");
    } catch (err) {
      console.warn("Login API error:", err);

      // Fallback: demo/mock login so hackathon demo doesn't block
      // Remove or tighten this when you have a real backend.
      console.info("Falling back to demo login (no backend).");
      loginStore({ email });
      navigate("/home");

      // If you prefer to show an error instead of fallback, uncomment:
      // setError("Login failed. Check server or try demo credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-2">Welcome back</h2>
        <p className="text-sm text-gray-500 mb-6">Login to continue to your personalized learning dashboard.</p>

        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md text-white ${loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-4 text-sm text-center">
          <span className="text-gray-600">Don't have an account? </span>
          <Link to="/signup" className="text-blue-600 hover:underline">Sign up</Link>
        </div>

        <div className="mt-6 text-xs text-gray-400">
          <div>Tip: If backend isn't ready, this page will use a demo fallback so you can continue the frontend demo.</div>
        </div>
      </div>
    </div>
  );
}
