import * as React from "react";
import { Toolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import ToolbarButton from "./toolbar/ToolbarButton";
import ButtonDensity from "./toolbar/ButtonDensity";
import ButtonExport from "./toolbar/ButtonExport";
import ButtonColumns from "./toolbar/ButtonColumns";
import ButtonFilters from "./toolbar/ButtonFilter";
import ButtonSearch from "./toolbar/ButtonSearch";
import { Typography, useTheme, LinearProgress } from "@mui/material";

interface DataGridToolbarProps {
  label: string;
  loading?: boolean; // اضافه شد
  onAddClick?: () => void;
  onRefreshClick?: () => void;
}

export default function DataGridToolbar({
  onAddClick,
  onRefreshClick,
  label,
  loading,
}: DataGridToolbarProps) {
  const theme = useTheme();

  return (
    <Box sx={{ width: "100%" }}>
      {/* Toolbar */}
      <Toolbar
        style={{
          display: "flex",
          paddingLeft: ".5rem",
          justifyContent: "space-between",
          borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
        }}
      >
        <Typography fontWeight={"bold"}>{label}</Typography>

        <Box display="flex" gap={0.5}>
          <ButtonSearch />
          <ButtonDensity />
          <ButtonExport />
          <ButtonColumns />
          <ButtonFilters />
          {onRefreshClick && (
            <ToolbarButton title="Refresh" onClick={onRefreshClick}>
              <RefreshIcon />
            </ToolbarButton>
          )}
          {onAddClick && (
            <ToolbarButton title="Add" onClick={onAddClick}>
              <AddIcon />
            </ToolbarButton>
          )}
        </Box>
      </Toolbar>

      {loading && <LinearProgress />}
    </Box>
  );
}
