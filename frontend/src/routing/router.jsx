import { createRootRoute, createRoute, createRouter, Outlet } from "@tanstack/react-router";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import MyUrlsPage from "../pages/MyUrlsPage";
import Navbar from "../components/Navbar";
import { AuthProvider } from "../context/AuthContext";

const rootRoute = createRootRoute({
  component: () => (
    <AuthProvider>
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans">
        <Navbar />
        <main className="flex-grow">
          <Outlet />
        </main>
      </div>
    </AuthProvider>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: RegisterPage,
});

const myUrlsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/my-urls",
  component: MyUrlsPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  myUrlsRoute,
]);

export const router = createRouter({ routeTree });
