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
    <nav className="border-b border-slate-100 bg-white/70 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 transform group-hover:scale-105 transition-all duration-300">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor"/>
              </svg>
            </div>
            <span className="text-xl font-extrabold text-slate-900 tracking-tight">
              snap<span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">url</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-6">
          {user ? (
            <>
              <Link
                to="/my-urls"
                className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Dashboard
              </Link>
              
              <div className="flex items-center gap-3.5 pl-5 border-l border-slate-200">
                {user.avatar && (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-8 w-8 rounded-full border border-slate-200 shadow-sm"
                  />
                )}
                <span className="hidden sm:inline text-sm font-semibold text-slate-700">
                  {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="rounded-lg bg-slate-50 border border-slate-200/80 px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200 cursor-pointer active:scale-95"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-semibold text-slate-600 hover:text-slate-950 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/15 hover:brightness-105 active:scale-95 transition-all duration-200 cursor-pointer"
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
