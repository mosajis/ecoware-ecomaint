import {createFileRoute} from "@tanstack/react-router";
import {lazy, Suspense} from "react";
import Spinner from "@/shared/components/Spinner";

const Page = lazy(() => import("@/pages/maintenance/componentJob/ComponentJob"));

export const Route = createFileRoute("/_protected/maintenance/component-job")({
  component: () => (
    <Suspense fallback={<Spinner/>}>
      <Page/>
    </Suspense>
  ),
});
