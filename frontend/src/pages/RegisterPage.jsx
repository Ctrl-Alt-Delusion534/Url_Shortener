import { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../context/AuthContext";
import { checkEmailExists } from "../api/auth";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailTaken, setEmailTaken] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const rules = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const isPasswordValid = Object.values(rules).every(Boolean);

  useEffect(() => {
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!email || !isEmailValid) {
      setEmailTaken(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const exists = await checkEmailExists(email);
        setEmailTaken(exists);
      } catch (err) {
        console.error(err);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (emailTaken) {
      setError("This email is already registered.");
      return;
    }

    if (!isPasswordValid) {
      setError("Please meet all password requirements before registering.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      navigate({ to: "/my-urls" });
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-20 flex items-center justify-center">
      <div className="w-full max-w-[400px] rounded-2xl p-8 sm:p-10 premium-card">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 font-sans">
            Create Account
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Sign up to track link performance and analytics.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600 text-center font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Anmol Kamath"
              className="w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none premium-input"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="anmol.kamath@example.com"
              className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none premium-input ${
                emailTaken 
                  ? "border-red-500 focus:border-red-500 focus:ring-red-100" 
                  : "border-slate-200"
              }`}
            />
            {emailTaken && (
              <p className="mt-1 text-xs text-red-500 font-semibold">
                This email is already registered.
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none premium-input"
            />
            {password.length > 0 && (
              <div className="mt-2.5 p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-1.5">
                <p className="font-semibold text-slate-500 mb-1">Password requirements:</p>
                <div className="flex items-center gap-2">
                  <span className={rules.length ? "text-emerald-600 font-semibold" : "text-slate-300"}>
                    {rules.length ? "✓" : "○"}
                  </span>
                  <span className={rules.length ? "text-emerald-700 font-medium" : "text-slate-500"}>
                    At least 8 characters
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={rules.uppercase ? "text-emerald-600 font-semibold" : "text-slate-300"}>
                    {rules.uppercase ? "✓" : "○"}
                  </span>
                  <span className={rules.uppercase ? "text-emerald-700 font-medium" : "text-slate-500"}>
                    At least 1 uppercase letter
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={rules.number ? "text-emerald-600 font-semibold" : "text-slate-300"}>
                    {rules.number ? "✓" : "○"}
                  </span>
                  <span className={rules.number ? "text-emerald-700 font-medium" : "text-slate-500"}>
                    At least 1 number
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={rules.special ? "text-emerald-600 font-semibold" : "text-slate-300"}>
                    {rules.special ? "✓" : "○"}
                  </span>
                  <span className={rules.special ? "text-emerald-700 font-medium" : "text-slate-500"}>
                    At least 1 special character
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none premium-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/15 hover:brightness-105 active:scale-[0.98] transition-all duration-200 flex items-center justify-center cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="flex h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
