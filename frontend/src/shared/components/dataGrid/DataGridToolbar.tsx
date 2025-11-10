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

interface DataGridToolbarProps {
  onAddClick?: () => void;
  onRefreshClick?: () => void;
}

export default function DataGridToolbar({
  onAddClick,
  onRefreshClick,
}: DataGridToolbarProps) {
  return (
    <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
      <Box display="flex" gap={0.5}>
        {onAddClick && (
          <ToolbarButton title="Add" onClick={onAddClick}>
            <AddIcon />
          </ToolbarButton>
        )}
        {onRefreshClick && (
          <ToolbarButton title="Refresh" onClick={onRefreshClick}>
            <RefreshIcon />
          </ToolbarButton>
        )}
      </Box>

      <Box display="flex" gap={0.5}>
        <ButtonSearch />
        <ButtonDensity />
        <ButtonExport />
        <ButtonColumns />
        <ButtonFilters />
      </Box>
    </Toolbar>
  );
}
