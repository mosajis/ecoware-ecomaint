import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const Page = lazy(() => import("@/pages/general/Maint"));

export const Route = createFileRoute("/_protected/general/maint")({
  component: Page,
});
