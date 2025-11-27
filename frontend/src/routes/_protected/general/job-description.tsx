import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const Page = lazy(
  () => import("@/pages/general/jobDescription/JobDescription")
);

export const Route = createFileRoute("/_protected/general/job-description")({
  component: Page,
});
