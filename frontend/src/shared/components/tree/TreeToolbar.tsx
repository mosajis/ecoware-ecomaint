import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmDialog from "../ConfirmDialog";
import SearchPopover from "./_component/SearchPopover";
import { memo, useCallback, useMemo, useRef, useState } from "react";

interface TreeToolbarProps {
  label?: string;
  onExpandAll?: () => void;
  onCollapseAll?: () => void;
  onSearch?: (value: string) => void;
  onRefresh?: () => void;
  onAdd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  hasSelection?: boolean;
  actions?: React.ReactNode;
}

const dividerSx = { height: 20 };

const ActionBtn = memo(
  ({
    icon,
    tooltip,
    onClick,
    disabled,
  }: {
    icon: React.ReactNode;
    tooltip: string;
    onClick?: () => void;
    disabled?: boolean;
  }) => (
    <Tooltip title={tooltip}>
      <span>
        <IconButton size="small" onClick={onClick} disabled={disabled}>
          {icon}
        </IconButton>
      </span>
    </Tooltip>
  ),
);

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
  const [confirmOpen, setConfirmOpen] = useState(false);
  const debounceRef = useRef<number | undefined>(undefined);

  const handleSearch = useCallback(
    (value: string) => {
      if (!onSearch) return;

      window.clearTimeout(debounceRef.current);
      debounceRef.current = window.setTimeout(() => {
        onSearch(value);
      }, 250);
    },
    [onSearch],
  );

  const buttons = useMemo(
    () =>
      [
        onExpandAll && {
          key: "expand",
          icon: <OpenInFullIcon />,
          tooltip: "Expand",
          onClick: onExpandAll,
        },
        onCollapseAll && {
          key: "collapse",
          icon: <CloseFullscreenIcon />,
          tooltip: "Collapse",
          onClick: onCollapseAll,
          divider: true,
        },
        onEdit && {
          key: "edit",
          icon: <EditIcon />,
          tooltip: "Edit",
          onClick: onEdit,
          disabled: !hasSelection,
        },
        onDelete && {
          key: "delete",
          icon: <DeleteIcon />,
          tooltip: "Delete",
          onClick: () => setConfirmOpen(true),
          disabled: !hasSelection,
        },
        onRefresh && {
          key: "refresh",
          icon: <RefreshIcon />,
          tooltip: "Refresh",
          onClick: onRefresh,
        },
        onAdd && {
          key: "add",
          icon: <AddIcon />,
          tooltip: "Add",
          onClick: onAdd,
        },
      ].filter(Boolean),
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
    <Box
      sx={(theme) => ({
        px: 0.5,
        py: 0.4,
        borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
        bgcolor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      })}
    >
      <Typography fontWeight="bold">{label}</Typography>

      <Stack direction="row" spacing={0.5} alignItems="center">
        {onSearch && <SearchPopover onSearch={handleSearch} />}

        <Divider orientation="vertical" sx={dividerSx} />

        {buttons.map((btn: any) => (
          <Box key={btn.key} display="flex" alignItems="center">
            <ActionBtn {...btn} />
            {btn.divider && <Divider orientation="vertical" sx={dividerSx} />}
          </Box>
        ))}

        {actions}
      </Stack>

      <ConfirmDialog
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          onDelete?.();
        }}
        title="Delete Item"
        message="Are you certain you want to delete this item?"
      />
    </Box>
  );
});

export default TreeToolbar;
