import { IconButton, Tooltip } from "@mui/material";
import type { ReactNode, MouseEventHandler } from "react";

interface DataGridActionsButtonProps {
  title: string;
  icon: ReactNode;

  onClick?: MouseEventHandler<HTMLButtonElement>;
  size?: number;
}

export default function DataGridActionsButton({
  title,
  icon,
  onClick,
  size = 26,
}: DataGridActionsButtonProps) {
  return (
    <Tooltip title={title}>
      <IconButton
        size="small"
        onClick={onClick}
        sx={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: "8px",
        }}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );
}
