import { LOCAL_STORAGE } from "@/const";
import LoginPage from "@/pages/auth/login/login.page";
import AppAthorization from "@/shared/components/AppAthorization";
import AppLayout from "@/shared/components/layout/AppLayout";
import {
  createRootRoute,
  createRoute,
  Outlet,
  redirect,
} from "@tanstack/react-router";

// --- Root ---
export const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// --- Pathless Protected Route ---
export const protectedRoute = createRoute({
  id: "protected",
  getParentRoute: () => rootRoute,
  component: () => (
    <AppAthorization>
      <AppLayout />
    </AppAthorization>
  ),
  beforeLoad: async ({ location }) => {
    const token = localStorage.getItem(LOCAL_STORAGE.ACCESS_KEY);
    if (!token) {
      throw redirect({
        to: "/auth/login",
        search: { redirect: location.href },
      });
    }
  },
});

// --- Redirect "/" → "/dashboard"
export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: async () => {
    throw redirect({ to: "/dashboard" });
  },
});

// --- Protected Dashboard ---
export const dashboardRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/dashboard",
  component: () => "Main Page",
});

export const AuthLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth/login",
  component: LoginPage,
});

// --- Route Tree ---
export const routeTree = rootRoute.addChildren([
  indexRoute.addChildren([AuthLoginRoute]),
  protectedRoute.addChildren([dashboardRoute]),
]);
