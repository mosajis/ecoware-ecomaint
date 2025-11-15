import { useState, ReactNode } from "react";
import {
  Stack,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  DialogContent,
  Typography,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import DataGridActionsButton from "./DataGridActionsButton";
import DialogHeader from "../dialog/DialogHeader";

interface DataGridActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  children?: ReactNode;
}

export default function DataGridActions({
  onEdit,
  onDelete,
  children,
}: DataGridActionsProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDeleteClick = () => {
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    setConfirmOpen(false);
    onDelete?.();
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
  };

  return (
    <>
      <Stack
        direction="row"
        spacing={0.5}
        display="flex"
        alignItems="center"
        height="100%"
      >
        {onEdit && (
          <DataGridActionsButton
            title="Edit"
            icon={<EditIcon fontSize="small" />}
            onClick={onEdit}
          />
        )}

        {onDelete && (
          <DataGridActionsButton
            title="Delete"
            icon={<DeleteIcon fontSize="small" />}
            onClick={handleDeleteClick}
          />
        )}

        {children}
      </Stack>

      {/* Confirm Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={handleCancelDelete}
        fullWidth
        maxWidth="xs"
      >
        <DialogHeader title="Delete Item" />
        <DialogContent dividers sx={{ py: 5 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <WarningAmberIcon
              color="error"
              sx={{
                fontSize: "3rem",
              }}
            />
            <Typography>
              Are you certain you want to delete this item?
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ display: "flex" }}>
          <Button
            sx={{ flex: 1 }}
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
          <Button sx={{ flex: 1 }} onClick={handleCancelDelete} color="inherit">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
