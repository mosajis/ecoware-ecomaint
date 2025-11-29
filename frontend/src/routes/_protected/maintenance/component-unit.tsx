import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const Page = lazy(
  () => import("@/pages/maintenance/componentUnit/ComponentUnit")
);

export const Route = createFileRoute("/_protected/maintenance/component-unit")({
  component: Page,
});
