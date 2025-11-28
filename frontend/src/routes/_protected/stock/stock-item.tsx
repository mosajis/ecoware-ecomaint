import Spinner from "@/shared/components/Spinner";
import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const Page = lazy(() => import("@/pages/stock/stockItem/StockItem"));

export const Route = createFileRoute("/_protected/stock/stock-item")({
  component: () => (
    <Suspense fallback={<Spinner />}>
      <Page />
    </Suspense>
  ),
});
