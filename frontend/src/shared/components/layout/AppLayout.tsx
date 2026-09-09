import Spinner from "../Spinner";
import Box from "@mui/material/Box";
import { alpha } from "@mui/material/styles";
import { lazy, Suspense, useMemo } from "react";
import { Outlet } from "@tanstack/react-router";

const TopMenu = lazy(() => import("@/shared/components/layout/TopMenu"));

const SideMenu = lazy(() => import("@/shared/components/layout/SideMenu"));
const Header = lazy(() => import("@/shared/components/layout/header/Header"));

function AppLayout() {
  const contentSx = useMemo(
    () => ({
      flexGrow: 1,
      width: "100%",
      height: "calc(100vh - 60px)",
      overflow: "auto",
      px: 1,
    }),
    [],
  );
  // "height: "100vh" withour flexDirection: "column"
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Suspense>
        <TopMenu />
        {/* <SideMenu /> */}
      </Suspense>

      <Box component="main" sx={{ flexGrow: 1, overflow: "hidden" }}>
        <Suspense fallback={<Spinner />}>
          <Header />
        </Suspense>

        <Box
          sx={(theme) => ({
            ...contentSx,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
          })}
        >
          <Suspense>
            <Outlet />
          </Suspense>
        </Box>
      </Box>
    </Box>
  );
}

export default AppLayout;
