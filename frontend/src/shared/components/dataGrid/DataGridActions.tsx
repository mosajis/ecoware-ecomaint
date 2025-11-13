import { useState, ReactNode } from "react";
import {
  Stack,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DataGridActionsButton from "./DataGridActionsButton";

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
      <Dialog open={confirmOpen} onClose={handleCancelDelete}>
        <DialogTitle>Are you sure you want to delete this item?</DialogTitle>
        <DialogActions sx={{ display: "flex" }}>
          <Button onClick={handleCancelDelete} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
