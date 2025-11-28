import Spinner from "@/shared/components/Spinner";
import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const Page = lazy(() => import("@/pages/stock/stockType/StockType"));

export const Route = createFileRoute("/_protected/stock/stock-type")({
  component: () => (
    <Suspense fallback={<Spinner />}>
      <Page />
    </Suspense>
  ),
});
