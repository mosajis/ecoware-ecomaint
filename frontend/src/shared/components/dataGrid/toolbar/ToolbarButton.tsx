import * as React from "react";
import Tooltip from "@mui/material/Tooltip";
import {
  ToolbarButton as DataGridToolbarButton,
  type ToolbarButtonProps as DataGridToolbarButtonProps,
} from "@mui/x-data-grid";

interface ToolbarButtonProps extends DataGridToolbarButtonProps {
  title: string; // متن Tooltip
  children: React.ReactNode; // محتوای دکمه (آیکن یا متن)
}

export default function ToolbarButton({
  title,
  children,
  ...props
}: ToolbarButtonProps) {
  return (
    <Tooltip title={title} arrow>
      <span>
        <DataGridToolbarButton size="small" {...props}>
          {children}
        </DataGridToolbarButton>
      </span>
    </Tooltip>
  );
}
