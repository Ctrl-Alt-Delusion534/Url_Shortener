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
      <div className="min-h-screen text-slate-900 flex flex-col font-sans relative overflow-hidden">
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[65%] h-[65%] rounded-full bg-gradient-to-tr from-blue-400/12 to-indigo-400/8 blur-[120px] animate-float-blob"></div>
          <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-purple-400/8 to-pink-400/8 blur-[120px] animate-float-blob-delayed"></div>
        </div>
        <Navbar />
        <main className="flex-grow relative z-10">
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
  component: MyUrlsRouteComponent,
});

function MyUrlsRouteComponent() {
  return <MyUrlsPage />;
}

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  myUrlsRoute,
]);

export const router = createRouter({ routeTree });
