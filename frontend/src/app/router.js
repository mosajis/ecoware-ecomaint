import { jsx as _jsx } from "react/jsx-runtime";
import { routeTree } from "@/routeTree.gen";
import { createRouter, RouterProvider } from "@tanstack/react-router";
const router = createRouter({ routeTree });
export default function AppRouter() {
    return _jsx(RouterProvider, { router: router });
}
