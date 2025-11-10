import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: async ({ location }) => {
    throw redirect({
      to: "/dashboard",
    });
  },
});
