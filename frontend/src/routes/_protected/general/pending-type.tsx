import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const Page = lazy(() => import("@/pages/general/PendingType"));

export const Route = createFileRoute("/_protected/general/pending-type")({
  component: Page,
});
