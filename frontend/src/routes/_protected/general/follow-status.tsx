import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const Page = lazy(() => import("@/pages/general/followStatus/FollowStatus"));

export const Route = createFileRoute("/_protected/general/follow-status")({
  component: Page,
});
