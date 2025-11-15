import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const Page = lazy(() => import("@/pages/general/location/Location"));

export const Route = createFileRoute("/_protected/general/location")({
  component: Page,
});
