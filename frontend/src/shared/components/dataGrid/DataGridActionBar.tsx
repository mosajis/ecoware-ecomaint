import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import type { SxProps, Theme } from "@mui/material/styles";
import { Fragment } from "react";
export interface DataGridActionItem {
  label: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  variant?: "text" | "outlined" | "contained";
  color?:
    | "primary"
    | "secondary"
    | "inherit"
    | "success"
    | "error"
    | "warning"
    | "info";
  disabled?: boolean;
  sx?: SxProps<Theme>;
}

interface DataGridActionBarProps {
  actions: DataGridActionItem[];
  size?: "small" | "medium" | "large";
}

const DataGridActionBar = ({
  actions,
  size = "small",
}: DataGridActionBarProps) => {
  return (
    <Box display="flex" alignItems="center">
      {actions.map((action, index) => (
        <Fragment key={action.label}>
          <Button
            size={size}
            variant={action.variant ?? "text"}
            color={action.color ?? "primary"}
            startIcon={action.icon}
            disabled={action.disabled}
            sx={action.sx}
            onClick={action.onClick}
          >
            {action.label}
          </Button>

          {index < actions.length - 1 && (
            <Divider orientation="vertical" variant="middle" flexItem />
          )}
        </Fragment>
      ))}
    </Box>
  );
};

export default DataGridActionBar;
