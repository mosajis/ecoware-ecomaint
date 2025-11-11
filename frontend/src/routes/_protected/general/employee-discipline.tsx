import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const Page = lazy(() => import("@/pages/general/EmployeeDiscipline"));

export const Route = createFileRoute("/_protected/general/employee-discipline")({
  component: Page,
});
