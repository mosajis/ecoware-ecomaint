import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Stack from "@mui/material/Stack";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import HeaderBreadcrumbs from "./HeaderBreadcrumbs";
import MenuButton from "./MenuButton";
import ColorModeIconDropdown from "./ColorModeIconDropdown";
import MenuIcon from "@mui/icons-material/Menu";
import Search from "../Search";
import { Box, IconButton } from "@mui/material";
import { useSetAtom } from "jotai";
import { atomSideMenuOpen } from "@/shared/atoms/layout.atom";
export default function Header() {
    const setOpen = useSetAtom(atomSideMenuOpen);
    const handleToggleMenu = () => {
        setOpen((o) => !o);
    };
    return (_jsxs(Stack, { direction: "row", sx: {
            p: "1rem",
            // pb: "0",
            display: { xs: "none", md: "flex" },
            width: "100%",
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "space-between",
        }, spacing: 2, children: [_jsxs(Box, { display: "flex", alignItems: "center", sx: { gap: 2 }, children: [_jsx(IconButton, { size: "small", onClick: handleToggleMenu, children: _jsx(MenuIcon, {}) }), _jsx(HeaderBreadcrumbs, {})] }), _jsxs(Stack, { direction: "row", sx: { gap: 1 }, children: [_jsx(Search, {}), _jsx(MenuButton, { showBadge: true, children: _jsx(NotificationsRoundedIcon, {}) }), _jsx(ColorModeIconDropdown, {})] })] }));
}
