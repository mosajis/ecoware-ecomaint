import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const Page = lazy(() => import("@/pages/general/discipline/Discipline"));

export const Route = createFileRoute("/_protected/general/discipline")({
  component: Page,
});
