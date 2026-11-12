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
import SearchPopper from "./_component/SearchPopover";
import { memo, useMemo, useState } from "react";

interface TreeToolbarProps {
  label?: string;
  onExpandAll?: () => void;
  onCollapseAll?: () => void;
  onSearchApply?: (value: string) => void;
  onSearchCancel?: () => void;
  onRefresh?: () => void;
  onAdd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  hasSelection?: boolean;
  actions?: React.ReactNode;
}

interface ToolbarButton {
  key: string;
  icon: React.ReactNode;
  tooltip: string;
  onClick: () => void;
  disabled?: boolean;
  divider?: boolean;
}

const dividerSx = { height: 20 };

const ActionBtn = memo(function ActionBtn({
  icon,
  tooltip,
  onClick,
  disabled,
}: {
  icon: React.ReactNode;
  tooltip: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <Tooltip title={tooltip}>
      <span>
        <IconButton size="small" onClick={onClick} disabled={disabled}>
          {icon}
        </IconButton>
      </span>
    </Tooltip>
  );
});

const TreeToolbar = memo(function TreeToolbar({
  label,
  onExpandAll,
  onCollapseAll,
  onSearchApply,
  onSearchCancel,
  onRefresh,
  onAdd,
  onEdit,
  onDelete,
  hasSelection = false,
  actions,
}: TreeToolbarProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const buttons = useMemo(() => {
    const list: (ToolbarButton | false | undefined)[] = [
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
    ];

    return list.filter((b): b is ToolbarButton => !!b);
  }, [
    onExpandAll,
    onCollapseAll,
    onEdit,
    onDelete,
    onRefresh,
    onAdd,
    hasSelection,
  ]);

  const hasSearch = !!onSearchApply && !!onSearchCancel;

  return (
    <>
      <Box
        sx={(theme) => ({
          px: 1,
          py: 0.5,
          borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
          bgcolor: (theme.vars || theme).palette.background.paper,
          borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        })}
      >
        <Typography fontWeight="bold">{label}</Typography>

        <Stack direction="row" spacing={0.5} alignItems="center">
          {hasSearch && (
            <>
              <SearchPopper onApply={onSearchApply} onCancel={onSearchCancel} />
              <Divider orientation="vertical" sx={dividerSx} />
            </>
          )}

          {buttons.map((btn) => (
            <Box key={btn.key} display="flex" alignItems="center">
              <ActionBtn
                icon={btn.icon}
                tooltip={btn.tooltip}
                disabled={btn.disabled}
                onClick={btn.onClick}
              />
              {btn.divider && <Divider orientation="vertical" sx={dividerSx} />}
            </Box>
          ))}

          {actions}
        </Stack>
      </Box>

      <ConfirmDialog
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          onDelete?.();
        }}
        title="Delete Item"
        message="Are you sure you want to delete this item?"
      />
    </>
  );
});

export default TreeToolbar;
