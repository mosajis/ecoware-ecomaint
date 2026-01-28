import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ButtonSearch from "./toolbar/ButtonSearch";
import ConfirmDialog from "../ConfirmDialog";
import Divider from "@mui/material/Divider";
import { useState, useCallback, useMemo, memo, useRef } from "react";
import { ReactNode } from "react";
import SearchPopover from "./_component/SearchPopover";

interface TreeToolbarProps {
  label?: string;
  onExpandAll?: () => void;
  onCollapseAll?: () => void;
  onFilter?: () => void;
  onSearch?: (value: string) => void;
  onRefresh?: () => void;
  onAdd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  hasSelection?: boolean;
  actions?: ReactNode;
}

interface ActionButton {
  key: string;
  icon: ReactNode;
  tooltip: string;
  onClick?: () => void;
  disabled?: boolean;
  show: boolean;
  hasDivider?: boolean;
}

const TreeToolbar = memo(function TreeToolbar({
  label,
  onExpandAll,
  onCollapseAll,
  onSearch,
  onRefresh,
  onAdd,
  onEdit,
  onDelete,
  hasSelection = false,
  actions,
}: TreeToolbarProps) {
  const [searchText, setSearchText] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const debounceRef = useRef<number | null>(null);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchText(value);

      if (!onSearch) return;

      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }

      debounceRef.current = window.setTimeout(() => {
        onSearch(value);
      }, 250); // sweet spot
    },
    [onSearch],
  );

  const boxSx = useMemo(
    () => (theme: any) => ({
      padding: "3.5px 0.2rem",
      paddingLeft: ".4rem",
      borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
      backgroundColor: (theme.vars || theme).palette.background.paper,
      borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }),
    [],
  );

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

  const buttons: ActionButton[] = useMemo(
    () => [
      {
        key: "expand",
        icon: <OpenInFullIcon />,
        tooltip: "Expand",
        onClick: onExpandAll,
        show: !!onExpandAll,
      },
      {
        key: "collapse",
        icon: <CloseFullscreenIcon />,
        tooltip: "Collapse",
        onClick: onCollapseAll,
        show: !!onCollapseAll,
        hasDivider: true,
      },
      {
        key: "edit",
        icon: <EditIcon />,
        tooltip: "Edit",
        onClick: onEdit,
        disabled: !hasSelection,
        show: !!onEdit,
      },
      {
        key: "delete",
        icon: <DeleteIcon />,
        tooltip: "Delete",
        onClick: handleDeleteClick,
        disabled: !hasSelection,
        show: !!onDelete,
      },
      {
        key: "refresh",
        icon: <RefreshIcon />,
        tooltip: "Refresh",
        onClick: onRefresh,
        show: !!onRefresh,
      },
      {
        key: "add",
        icon: <AddIcon />,
        tooltip: "Add",
        onClick: onAdd,
        show: !!onAdd,
      },
    ],
    [
      onExpandAll,
      onCollapseAll,
      onEdit,
      onDelete,
      onRefresh,
      onAdd,
      hasSelection,
    ],
  );

  return (
    <Box sx={boxSx}>
      <Typography fontWeight="bold">{label}</Typography>

      <Stack direction="row" spacing={0.5} alignItems="center">
        {onSearch && <SearchPopover onSearch={handleSearchChange} />}
        <Divider orientation="vertical" style={{ color: "red", height: 20 }} />
        {buttons.map(
          (btn) =>
            btn.show && (
              <Box
                key={btn.key}
                display={"flex"}
                alignItems={"center"}
                gap={0.5}
              >
                <Tooltip title={btn.tooltip}>
                  <span>
                    <IconButton
                      size="small"
                      onClick={btn.onClick}
                      disabled={btn.disabled}
                    >
                      {btn.icon}
                    </IconButton>
                  </span>
                </Tooltip>
                {btn.hasDivider && (
                  <Divider
                    orientation="vertical"
                    style={{ color: "red", height: 20 }}
                  />
                )}
              </Box>
            ),
        )}

        {actions && <Box>{actions}</Box>}
      </Stack>
      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmOpen}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Item"
        message="Are you certain you want to delete this item?"
      />
    </Box>
  );
});

export default TreeToolbar;
