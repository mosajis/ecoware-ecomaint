import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { LOCAL_STORAGE } from "@/const";
import { authorization } from "@/pages/auth/auth.api";
import { queryClient } from "@/core/api/queryClient";
import { alpha, Box } from "@mui/material";
import { useSetAtom } from "jotai";
import { atomAuth } from "@/pages/auth/auth.atom";
import { lazy, Suspense, useEffect, useState } from "react";
import Spinner from "@/shared/components/Spinner";
// Lazy load کامپوننت‌ها
const SideMenu = lazy(() => import("@/shared/components/layout/SideMenu"));
const Header = lazy(() => import("@/shared/components/layout/Header"));
async function fetchAuthStatus() {
    try {
        const token = localStorage.getItem(LOCAL_STORAGE.ACCESS_KEY);
        if (!token)
            return { authorized: false };
        const res = await queryClient.fetchQuery({
            queryKey: ["authorization"],
            queryFn: authorization,
            staleTime: 1000 * 60 * 2,
        });
        return { authorized: !!res.authorized, user: res.user };
    }
    catch (err) {
        return { authorized: false };
    }
}
export const Route = createFileRoute("/_protected")({
    component: () => {
        const setAuth = useSetAtom(atomAuth);
        const [loading, setLoading] = useState(true);
        useEffect(() => {
            const fetchAuth = async () => {
                const data = await fetchAuthStatus();
                setAuth(data);
                setLoading(false);
            };
            fetchAuth();
        }, [setAuth]);
        if (loading) {
            return (_jsx(Spinner, {}));
        }
        return (_jsxs(Box, { sx: { display: "flex", height: "100vh" }, children: [_jsx(SideMenu, {}), _jsxs(Box, { component: "main", sx: {
                        flexGrow: 1,
                        overflow: "hidden",
                    }, children: [_jsx(Suspense, { children: _jsx(Header, {}) }), _jsx(Box, { width: "100%", height: "calc(100vh - 80px)", overflow: "auto", px: 1, sx: (theme) => ({
                                flexGrow: 1,
                                backgroundColor: theme.vars
                                    ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
                                    : alpha(theme.palette.background.default, 1),
                                overflow: "auto",
                            }), children: _jsx(Suspense, { fallback: _jsx(Spinner, {}), children: _jsx(Outlet, {}) }) })] })] }));
    },
    beforeLoad: async ({ location }) => {
        // const data = await fetchAuthStatus();
        // if (!data.authorized) {
        if (false) {
            throw redirect({
                to: "/auth/login",
                search: { redirect: location.href },
            });
        }
    },
});
