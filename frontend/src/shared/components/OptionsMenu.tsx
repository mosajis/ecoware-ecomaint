import * as React from "react";
import Divider from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MuiMenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import AccountBox from "@mui/icons-material/AccountBox";
import MenuButton from "./layout/MenuButton";
import FormDialog from "./formDialog/FormDialog";
import { styled } from "@mui/material/styles";
import { TextField, Alert, Box } from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import { AuthLoginRoute } from "@/app/router/routes/auth.routes";
import { logout, changePassword } from "@/pages/auth/auth.api";

const MenuItem = styled(MuiMenuItem)({ minWidth: 130 });

export default function OptionsMenu() {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [modalOpen, setModalOpen] = React.useState(false);
  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogOut = () => {
    logout().then(() => {
      window.localStorage.clear();
      navigate({ to: AuthLoginRoute.path });
    });
  };

  const openModal = () => {
    setModalOpen(true);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError(null);
  };

  const closeModal = () => {
    if (!submitting) setModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    try {
      setSubmitting(true);
      await changePassword({ oldPassword, newPassword });
      setModalOpen(false);
      await logout();
      window.localStorage.clear();
      navigate({ to: AuthLoginRoute.path });
    } catch (err: any) {
      setError(err?.message || "An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <MenuButton onClick={handleClick} sx={{ borderColor: "transparent" }}>
        <MoreVertRoundedIcon />
      </MenuButton>

      <Menu
        anchorEl={anchorEl}
        id="menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={openModal}>
          <ListItemIcon>
            <AccountBox fontSize="small" />
          </ListItemIcon>
          <ListItemText>Change Password</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogOut}>
          <ListItemIcon>
            <LogoutRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>

      <FormDialog
        open={modalOpen}
        onClose={closeModal}
        onCancelClick={closeModal}
        title="Change Password"
        submitting={submitting}
        onSubmit={handleSubmit}
        submitText="Change Password"
        cancelText="Cancel"
        maxWidth="xs"
      >
        <Box gap={1.5} display={"flex"} flexDirection={"column"}>
          <Alert severity="error" sx={{ display: error ? "flex" : "none" }}>
            {error}
          </Alert>
          <TextField
            label="Current Password"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            disabled={submitting}
            fullWidth
            size="small"
          />
          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={submitting}
            fullWidth
            size="small"
          />
          <TextField
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={submitting}
            fullWidth
            size="small"
          />
        </Box>
      </FormDialog>
    </>
  );
}
