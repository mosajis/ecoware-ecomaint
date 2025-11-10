import Dashboard from "@/pages/dashboard/Dashboard";
import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/_protected/dashboard")({
    component: Dashboard,
});
