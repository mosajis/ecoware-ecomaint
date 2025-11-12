import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const Page = lazy(() => import("@/pages/general/CounterType"));

export const Route = createFileRoute("/_protected/general/counter-type")({
  component: Page,
});
