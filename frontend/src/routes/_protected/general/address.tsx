import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const Page = lazy(() => import("@/pages/general/address/Address"));

export const Route = createFileRoute("/_protected/general/address")({
  component: Page,
});
