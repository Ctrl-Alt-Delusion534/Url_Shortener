import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate({ to: "/login" });
  };

  return (
    <nav className="border-b border-[#e2e8f0] bg-white/90 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2563eb] text-white font-bold shadow-sm">
              <span>⚡</span>
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">
              snap<span className="text-[#2563eb]">url</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-6">
          {user ? (
            <>
              <Link
                to="/my-urls"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Dashboard
              </Link>
              
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                {user.avatar && (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-7 w-7 rounded-full border border-slate-200 shadow-sm"
                  />
                )}
                <span className="hidden sm:inline text-sm font-medium text-slate-700">
                  {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-slate-600 hover:text-slate-950 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-[#2563eb] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1d4ed8] transition-all duration-200 cursor-pointer"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
