import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const Page = lazy(() => import("@/pages/general/Discipline"));

export const Route = createFileRoute("/_protected/general/discipline")({
  component: Page,
});
