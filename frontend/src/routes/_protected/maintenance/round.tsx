import {createFileRoute} from "@tanstack/react-router";
import {z} from "zod";
import {lazy, Suspense} from "react";
import Spinner from "@/shared/components/Spinner";

const Page = lazy(() => import("@/pages/maintenance/round/Round"));

const tabSearchSchema = z.object({
  tab: z.string().optional(),
});

export const Route = createFileRoute("/_protected/maintenance/round")({
  validateSearch: (search) => tabSearchSchema.parse(search),
  component: () => (
    <Suspense fallback={<Spinner/>}>
      <Page/>
    </Suspense>
  ),
});
