import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import SelectContent from "../SelectContent";
import TopMenuContent from "./TopMenuContent";

import { useAtomValue } from "jotai";
import { atomAuth } from "@/pages/auth/auth.atom";
import OptionsMenu from "../OptionsMenu";
import TopMenuSelectContent from "../TopMenuSelectContent";

const topbarHeight = 48;

const Topbar = styled(Box)(({ theme }) => ({
  width: "100%",
  height: topbarHeight,
  minHeight: topbarHeight,
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: "flex",
  alignItems: "center",
  padding: "0 10px",
  boxSizing: "border-box",
}));

export default function TopbarMenu() {
  const auth = useAtomValue(atomAuth);

  return (
    <Topbar
      sx={{
        flexDirection: "row-reverse",
        backgroundColor: "primary.dark",
        color: "primary.contrastText",

        "& .MuiSvgIcon-root": {
          color: "inherit",
        },

        "& .MuiListItemIcon-root": {
          color: "inherit",
        },

        "& .MuiButtonBase-root:hover": {
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.12)",
          borderColor: "rgba(255, 255, 255, 0.18)",
        },

        "& .MuiButtonBase-root.Mui-selected": {
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.16)",
          borderColor: "rgba(255, 255, 255, 0.24)",
        },

        "& .MuiButtonBase-root.Mui-selected:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.20)",
          borderColor: "rgba(255, 255, 255, 0.28)",
        },

        "& .MuiButtonBase-root": {
          color: "inherit",
          backgroundColor: "transparent",
        },
      }}
    >
      <Box
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          bgcolor: "inherit",
          color: "inherit",
          minWidth: 0,
        }}
      >
        <TopMenuSelectContent />
      </Box>

      <Divider
        orientation="vertical"
        flexItem
        sx={{
          mx: { xs: 1, sm: 2 },
        }}
      />

      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          alignItems: "center",
          overflowX: "auto",
          overflowY: "hidden",

          "&::-webkit-scrollbar": {
            height: 0,
          },
        }}
      >
        <TopMenuContent />
      </Box>

      <Divider
        orientation="vertical"
        flexItem
        sx={{
          mx: { xs: 1, sm: 2 },
        }}
      />

      <Stack
        direction="row"
        sx={{
          gap: 1,
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <Avatar
          alt={auth.user?.tblEmployee?.firstName || ""}
          sx={{
            width: 38,
            height: 38,
            fontSize: 15,
            fontWeight: "bold",
            border: "1px solid white",
            backgroundColor: "transparent",

            "& .MuiSelect-root": {
              bgcolor: "inherit",
              color: "inherit",
              maxHeight: 40,
            },
          }}
        >
          {auth.user?.tblEmployee?.firstName?.[0]}
          {auth.user?.tblEmployee?.lastName?.[0]}
        </Avatar>

        <Box
          sx={{
            display: { xs: "none", lg: "block" },
            minWidth: 0,

            "& .MuiButtonBase-root": {
              bgcolor: "transparent",
            },
          }}
        >
          <Typography variant="body2" fontWeight="bold" noWrap>
            {auth?.user?.userName}
          </Typography>

          <Typography variant="caption" noWrap>
            {auth?.user?.tblEmployee?.firstName}{" "}
            {auth?.user?.tblEmployee?.lastName}
          </Typography>
        </Box>

        <OptionsMenu />
      </Stack>
    </Topbar>
  );
}
