import { useState, ReactNode } from "react";
import {
  Stack,
  Dialog,
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
import ConfirmDialog from "../ConfirmDialog";

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
      <ConfirmDialog
        open={confirmOpen}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Item"
        message="Are you certain you want to delete this item?"
      />
    </>
  );
}
