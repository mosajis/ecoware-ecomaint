import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import MenuIcon from "@mui/icons-material/Menu";

import { Stack, Box, IconButton } from "@mui/material";
import { useSetAtom } from "jotai";
import { atomSideMenuOpen } from "@/shared/atoms/layout.atom";

import HeaderBreadcrumbs from "./HeaderBreadcrumbs";
import MenuButton from "./MenuButton";
import ColorModeIconDropdown from "./ColorModeIconDropdown";
import Search from "../Search";

export default function Header() {
  const setOpen = useSetAtom(atomSideMenuOpen);

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      spacing={2}
      sx={{
        p: 2,
        display: { xs: "none", md: "flex" },
        width: "100%",
      }}
    >
      {/* Left side: Menu button + Breadcrumbs */}
      <Box display="flex" alignItems="center" gap={2}>
        <IconButton size="small" onClick={() => setOpen((o) => !o)}>
          <MenuIcon />
        </IconButton>
        <HeaderBreadcrumbs />
      </Box>

      {/* Right side: Search + Notifications + Color mode */}
      <Stack direction="row" spacing={1} alignItems="center">
        <Search />
        <MenuButton showBadge>
          <NotificationsRoundedIcon />
        </MenuButton>
        <ColorModeIconDropdown />
      </Stack>
    </Stack>
  );
}
