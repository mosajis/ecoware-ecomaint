import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const Page = lazy(() => import("@/pages/general/Employee"));

export const Route = createFileRoute("/_protected/general/employee")({
  component: Page,
});
