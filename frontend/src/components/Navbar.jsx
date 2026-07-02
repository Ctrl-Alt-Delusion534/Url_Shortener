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
          <Link to="/" className="flex items-center gap-1 group">
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              snap<span className="font-medium text-slate-500">url</span>
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
                className="rounded-lg bg-slate-900 hover:bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 cursor-pointer"
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
