import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate({ to: "/my-urls" });
    } catch (err) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f3f4f6] px-4 py-20 text-slate-900 flex items-center justify-center font-sans">
      <div className="w-full max-w-[420px] rounded-lg border border-[#e2e8f0] bg-white p-8 shadow-sm sm:p-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">
            Login
          </h1>
        </div>

        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="anmol.kamath@example.com"
              className="w-full rounded-lg border border-[#cbd5e1] bg-white px-4 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              className="w-full rounded-lg border border-[#cbd5e1] bg-white px-4 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#2563eb] py-2 text-sm font-semibold text-white shadow hover:bg-[#1d4ed8] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
          >
            {loading ? (
              <span className="flex h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-[#2563eb] hover:text-[#1d4ed8] hover:underline transition-colors">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
