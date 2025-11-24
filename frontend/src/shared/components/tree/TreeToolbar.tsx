import { useState, useCallback } from "react";
import {
  TextField,
  IconButton,
  Stack,
  Tooltip,
  Box,
  Typography,
} from "@mui/material";
import { ReactNode } from "react";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import ButtonSearch from "./toolbar/ButtonSearch";

interface TreeToolbarProps {
  label?: string;
  onExpandAll?: () => void;
  onCollapseAll?: () => void;
  onFilter?: () => void;
  onSearch?: (value: string) => void;
  onRefresh?: () => void;
  onAdd?: () => void;
  actions?: ReactNode;
}

export default function TreeToolbar({
  label,
  onExpandAll,
  onCollapseAll,
  onFilter,
  onSearch,
  onRefresh,
  onAdd,
  actions,
}: TreeToolbarProps) {
  const [searchText, setSearchText] = useState("");

  // تایپ دقیق value: string
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchText(value);
      onSearch?.(value);
    },
    [onSearch]
  );

  return (
    <Box>
      <Box
        sx={(theme) => ({
          padding: "7.5px 0.5rem",
          borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
          backgroundColor: (theme.vars || theme).palette.background.paper,
          borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        })}
      >
        <Typography fontWeight="bold">{label}</Typography>

        <Stack direction="row" spacing={0.5} alignItems="center">
          {/* Search Input */}
          {onSearch && <ButtonSearch onSearch={handleSearchChange} />}

          {onExpandAll && (
            <Tooltip title="Expand All">
              <IconButton size="small" onClick={onExpandAll}>
                <OpenInFullIcon />
              </IconButton>
            </Tooltip>
          )}

          {onCollapseAll && (
            <Tooltip title="Collapse All">
              <IconButton size="small" onClick={onCollapseAll}>
                <CloseFullscreenIcon />
              </IconButton>
            </Tooltip>
          )}

          {onRefresh && (
            <Tooltip title="Refresh">
              <IconButton size="small" onClick={onRefresh}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          )}

          {onAdd && (
            <Tooltip title="Add">
              <IconButton size="small" onClick={onAdd}>
                <AddIcon />
              </IconButton>
            </Tooltip>
          )}

          {/* Optional extra actions */}
          {actions && <Box>{actions}</Box>}
        </Stack>
      </Box>
    </Box>
  );
}
