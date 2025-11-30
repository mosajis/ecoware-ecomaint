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

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        display: { xs: "none", md: "block" },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: "background.paper",
        },
      }}
    >
      <Box
        sx={{
          height: 70,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <SelectContent />
      </Box>

      <Divider />

      <Box
        sx={{
          overflow: "auto",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <MenuContent />
      </Box>

      {/* <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: "center",
          borderTop: "1px solid",
          borderColor: "divider",
          justifyContent: open ? "initial" : "center",
        }}
      >
        <Avatar alt={auth.user?.uUserName} sx={{ width: 36, height: 36 }}>
          {auth.user?.uUserName?.[0]}
        </Avatar>

        <Box sx={{ mr: "auto" }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {auth.user?.uUserName}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {auth.user?.uName || "Fill Name"}
          </Typography>
        </Box> */}

      {/* <OptionsMenu /> */}
      {/* </Stack> */}
    </Drawer>
  );
}
