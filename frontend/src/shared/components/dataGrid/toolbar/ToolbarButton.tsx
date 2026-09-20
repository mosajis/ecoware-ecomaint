import Tooltip from "@mui/material/Tooltip";
import {
  ToolbarButton as DataGridToolbarButton,
  type ToolbarButtonProps as DataGridToolbarButtonProps,
} from "@mui/x-data-grid";
import * as React from "react";

interface ToolbarButtonProps extends DataGridToolbarButtonProps {
  title: string; // متن Tooltip
  children: React.ReactNode; // محتوای دکمه (آیکن یا متن)
  dataCy?: string;
}

export default function ToolbarButton({
  title,
  children,
  dataCy,
  ...props
}: ToolbarButtonProps) {
  return (
    <Tooltip title={title} arrow data-cy={dataCy}>
      <DataGridToolbarButton size="small" {...props}>
        {children}
      </DataGridToolbarButton>
    </Tooltip>
  );
}
