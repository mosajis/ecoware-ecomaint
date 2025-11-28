import Spinner from "@/shared/components/Spinner";
import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const Page = lazy(() => import("@/pages/stock/stockUsed/StockUsed"));

export const Route = createFileRoute("/_protected/stock/stock-used")({
  component: () => (
    <Suspense fallback={<Spinner />}>
      <Page />
    </Suspense>
  ),
});
