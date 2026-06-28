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
    <div className="min-h-[calc(100vh-4rem)] bg-[#f3f4f6] px-4 py-16 text-slate-900 flex items-center justify-center font-sans">
      <div className="w-full max-w-[420px] rounded-lg border border-[#e2e8f0] bg-white p-8 shadow-sm sm:p-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">
            Register
          </h1>
        </div>

        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Anmol Kamath"
              className="w-full rounded-lg border border-[#cbd5e1] bg-white px-4 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="anmol.kamath@example.com"
              className={`w-full rounded-lg border bg-white px-4 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition ${
                emailTaken 
                  ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100" 
                  : "border-[#cbd5e1] focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100"
              }`}
            />
            {emailTaken && (
              <p className="mt-1 text-xs text-red-500 font-semibold">
                This email is already registered.
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-[#cbd5e1] bg-white px-4 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100"
            />
            {password.length > 0 && (
              <div className="mt-2 p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs space-y-1">
                <p className="font-semibold text-slate-500 mb-1.5">Password requirements:</p>
                <div className="flex items-center gap-1.5">
                  <span className={rules.length ? "text-emerald-600" : "text-slate-400"}>
                    {rules.length ? "✓" : "○"}
                  </span>
                  <span className={rules.length ? "text-emerald-700" : "text-slate-500"}>
                    At least 8 characters
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={rules.uppercase ? "text-emerald-600" : "text-slate-400"}>
                    {rules.uppercase ? "✓" : "○"}
                  </span>
                  <span className={rules.uppercase ? "text-emerald-700" : "text-slate-500"}>
                    At least 1 uppercase letter
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={rules.number ? "text-emerald-600" : "text-slate-400"}>
                    {rules.number ? "✓" : "○"}
                  </span>
                  <span className={rules.number ? "text-emerald-700" : "text-slate-500"}>
                    At least 1 number
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={rules.special ? "text-emerald-600" : "text-slate-400"}>
                    {rules.special ? "✓" : "○"}
                  </span>
                  <span className={rules.special ? "text-emerald-700" : "text-slate-500"}>
                    At least 1 special character
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-[#cbd5e1] bg-white px-4 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#2563eb] py-2.5 text-sm font-semibold text-white shadow hover:bg-[#1d4ed8] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
          >
            {loading ? (
              <span className="flex h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-[#2563eb] hover:text-[#1d4ed8] hover:underline transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
