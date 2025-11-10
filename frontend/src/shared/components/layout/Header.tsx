import Stack from "@mui/material/Stack";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import HeaderBreadcrumbs from "./HeaderBreadcrumbs";
import MenuButton from "./MenuButton";
import ColorModeIconDropdown from "./ColorModeIconDropdown";
import MenuIcon from "@mui/icons-material/Menu";

import Search from "../Search";
import {Box, IconButton} from "@mui/material";
import {useSetAtom} from "jotai";
import {atomSideMenuOpen} from "@/shared/atoms/layout.atom";

export default function Header() {
  const setOpen = useSetAtom(atomSideMenuOpen);

  const handleToggleMenu = () => {
    setOpen((o) => !o);
  };

  return (
    <Stack
      direction="row"
      sx={{
        p: "1rem",
        // pb: "0",
        display: { xs: "none", md: "flex" },
        width: "100%",
        alignItems: { xs: "flex-start", md: "center" },
        justifyContent: "space-between",
      }}
      spacing={2}
    >
      <Box display={"flex"} alignItems="center" sx={{ gap: 2 }}>
        <IconButton size="small" onClick={handleToggleMenu}>
          <MenuIcon />
        </IconButton>
        <HeaderBreadcrumbs />
      </Box>
      <Stack direction="row" sx={{ gap: 1 }}>
        <Search />
        <MenuButton showBadge>
          <NotificationsRoundedIcon />
        </MenuButton>
        <ColorModeIconDropdown />
      </Stack>
    </Stack>
  );
}
