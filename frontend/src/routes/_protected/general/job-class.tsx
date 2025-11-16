import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const Page = lazy(() => import("@/pages/general/jobClass/JobClass"));

export const Route = createFileRoute("/_protected/general/job-class")({
  component: Page,
});
