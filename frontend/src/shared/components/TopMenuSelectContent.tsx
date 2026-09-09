import * as React from "react";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";

import DevicesRoundedIcon from "@mui/icons-material/DevicesRounded";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { useAtom } from "jotai";
import { useNavigate } from "@tanstack/react-router";

import { atomInstallations, atomRig } from "../atoms/general.atom";

export default function TopMenuSelectContent() {
  const navigate = useNavigate();

  const [selectedRig, setSelectedRig] = useAtom(atomRig);
  const [installations, setInstallations] = useAtom(atomInstallations);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const menuOpen = Boolean(anchorEl);

  React.useEffect(() => {
    if (installations.length === 0) return;
    if (!selectedRig) return;

    const isValid = installations.some(
      (item) => item.instId === selectedRig.instId,
    );

    if (!isValid) {
      setSelectedRig(installations[0]);
    }
  }, [installations, selectedRig, setSelectedRig]);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (instId: number) => {
    const selected = installations.find((item) => item.instId === instId);

    if (!selected) return;

    setSelectedRig(selected);
    handleClose();

    navigate({
      to: "/",
    });
  };

  return (
    <>
      <ButtonBase
        onClick={handleOpen}
        aria-controls={menuOpen ? "installation-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={menuOpen ? "true" : undefined}
        sx={(theme) => ({
          width: "fit",
          minHeight: 40,
          px: 1,
          borderRadius: 1,

          color: "inherit",

          backgroundColor: "rgba(255, 255, 255, 0.06)",
          border: "1px solid rgba(255, 255, 255, 0.10)",

          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",

          transition: "background-color 180ms ease, border-color 180ms ease",

          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.12)",
            borderColor: "rgba(255, 255, 255, 0.18)",
          },

          "&:focus-visible": {
            outline: `2px solid ${theme.palette.primary.light}`,
            outlineOffset: 2,
          },

          [theme.breakpoints.down("sm")]: {
            maxWidth: 180,
          },

          [theme.breakpoints.down("xs")]: {
            maxWidth: 150,
          },
        })}
      >
        {selectedRig ? (
          <Stack
            direction="row"
            sx={{
              width: "100%",
              alignItems: "center",
              gap: 1,
              minWidth: 0,
            }}
          >
            <Avatar
              sx={(theme) => ({
                width: 28,
                height: 28,

                backgroundColor: theme.palette.background.paper,

                color: theme.palette.text.secondary,

                border: `1px solid ${theme.palette.divider}`,

                flexShrink: 0,
              })}
            >
              <DevicesRoundedIcon sx={{ fontSize: 16 }} />
            </Avatar>

            <Box
              sx={{
                flex: 1,
                minWidth: 0,
                textAlign: "left",
              }}
            >
              <Box
                component="div"
                sx={{
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  lineHeight: 1.2,
                  color: "inherit",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {selectedRig.name}
              </Box>

              {selectedRig.caption && (
                <Box
                  component="div"
                  sx={{
                    fontSize: "0.68rem",
                    lineHeight: 1.2,
                    color: "inherit",
                    opacity: 0.7,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {selectedRig.caption}
                </Box>
              )}
            </Box>

            <ExpandMoreIcon
              sx={{
                fontSize: 18,
                color: "inherit",
                flexShrink: 0,
              }}
            />
          </Stack>
        ) : (
          <Stack
            direction="row"
            sx={{
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
              color: "inherit",
              minWidth: 0,
            }}
          >
            <Box
              component="span"
              sx={{
                fontSize: "0.78rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              Select installation
            </Box>

            <ExpandMoreIcon
              sx={{
                fontSize: 18,
                color: "inherit",
                flexShrink: 0,
              }}
            />
          </Stack>
        )}
      </ButtonBase>

      <Menu
        id="installation-menu"
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        slotProps={{
          paper: {
            sx: {
              mt: 0.5,
              minWidth: 240,
              maxWidth: 320,
              py: 0.5,
              width: {
                xs: "calc(100vw - 20px)",
                sm: "auto",
              },
            },
          },
        }}
      >
        {installations.map((item) => {
          const selected = selectedRig?.instId === item.instId;

          return (
            <MenuItem
              key={item.instId}
              selected={selected}
              onClick={() => handleChange(item.instId)}
              sx={{
                minHeight: 44,
                py: 0.5,
                px: 1.25,
                minWidth: 0,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 36,
                  flexShrink: 0,
                }}
              >
                <Avatar
                  sx={(theme) => ({
                    width: 28,
                    height: 28,

                    backgroundColor: theme.palette.background.paper,

                    color: theme.palette.text.secondary,

                    border: `1px solid ${theme.palette.divider}`,
                  })}
                >
                  <DevicesRoundedIcon sx={{ fontSize: 16 }} />
                </Avatar>
              </ListItemIcon>

              <ListItemText
                primary={item.name}
                secondary={item.caption}
                primaryTypographyProps={{
                  fontSize: "0.8rem",
                  fontWeight: selected ? 600 : 500,
                  noWrap: true,
                }}
                secondaryTypographyProps={{
                  fontSize: "0.68rem",
                  noWrap: true,
                }}
                sx={{
                  minWidth: 0,
                }}
              />
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}
