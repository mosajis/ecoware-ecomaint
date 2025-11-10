import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import SelectContent from "../SelectContent";
import MenuContent from "./MenuContent";
import OptionsMenu from "../OptionsMenu";
import { useAtomValue } from "jotai";
import { atomAuth } from "@/pages/auth/auth.atom";
import { atomSideMenuOpen } from "@/shared/atoms/layout.atom";
const drawerWidth = 240;
const drawerClosedWidth = 0;
const Drawer = styled(MuiDrawer)(({ open }) => ({
    width: open ? drawerWidth : drawerClosedWidth,
    height: "100%",
    "& .MuiDrawer-paper": {
        width: open ? drawerWidth : drawerClosedWidth,
        backgroundColor: "#f5f6fa",
        transform: open ? "translateX(0)" : `translateX(-${drawerWidth}px)`,
        transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    },
}));
export default function SideMenu() {
    const auth = useAtomValue(atomAuth);
    const open = useAtomValue(atomSideMenuOpen);
    return (_jsxs(Drawer, { variant: "permanent", open: open, sx: {
            display: { xs: "none", md: "block" },
            [`& .${drawerClasses.paper}`]: {
                backgroundColor: "background.paper",
            },
        }, children: [_jsx(Box, { sx: {
                    height: 70,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }, children: _jsx(SelectContent, {}) }), _jsx(Divider, {}), _jsx(Box, { sx: {
                    overflow: "auto",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                }, children: _jsx(MenuContent, {}) }), _jsxs(Stack, { direction: "row", sx: {
                    p: 2,
                    gap: 1,
                    alignItems: "center",
                    borderTop: "1px solid",
                    borderColor: "divider",
                    justifyContent: open ? "initial" : "center",
                }, children: [_jsx(Avatar, { alt: auth.user?.uUserName, sx: { width: 36, height: 36 }, children: auth.user?.uUserName?.[0] }), _jsxs(Box, { sx: { mr: "auto" }, children: [_jsx(Typography, { variant: "body2", sx: { fontWeight: 500 }, children: auth.user?.uUserName }), _jsx(Typography, { variant: "caption", sx: { color: "text.secondary" }, children: auth.user?.uName || "Fill Name" })] }), _jsx(OptionsMenu, {})] })] }));
}
