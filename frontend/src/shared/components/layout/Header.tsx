import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import MenuIcon from "@mui/icons-material/Menu";

import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useSetAtom } from "jotai";
import { atomSideMenuOpen } from "@/shared/atoms/layout.atom";

import HeaderBreadcrumbs from "./HeaderBreadcrumbs";
import MenuButton from "./MenuButton";
import ColorModeIconDropdown from "./ColorModeIconDropdown";
import Search from "./DigitalTime";
import LanguageModeIconDropdown from "./LanguageModeIconDropdown";
import DigitalTime from "./DigitalTime";

export default function Header() {
  const setOpen = useSetAtom(atomSideMenuOpen);

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        p: 1,
        display: { xs: "none", md: "flex" },
        width: "100%",
      }}
    >
      {/* Left side: Menu button + Breadcrumbs */}
      <Box display="flex" alignItems="center" gap={1.5}>
        <IconButton size="small" onClick={() => setOpen((o) => !o)}>
          <MenuIcon />
        </IconButton>
        <HeaderBreadcrumbs />
      </Box>

      {/* Right side: Search + Notifications + Color mode */}
      <Stack direction="row" spacing={1} alignItems="center">
        <DigitalTime />
        <MenuButton showBadge>
          <NotificationsRoundedIcon />
        </MenuButton>
        <LanguageModeIconDropdown />
        <ColorModeIconDropdown />
      </Stack>
    </Stack>
  );
}
