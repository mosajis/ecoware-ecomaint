import { jsx as _jsx } from "react/jsx-runtime";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { lazy, Suspense } from "react";
import Spinner from "@/shared/components/Spinner";
const Page = lazy(() => import("@/pages/maintenance/componentType/ComponentTypeListView"));
const tabSearchSchema = z.object({
    tab: z.string().optional(),
});
export const Route = createFileRoute("/_protected/maintenance/component-type")({
    validateSearch: (search) => tabSearchSchema.parse(search),
    component: () => (_jsx(Suspense, { fallback: _jsx(Spinner, {}), children: _jsx(Page, {}) })),
});
