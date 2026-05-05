import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import type { SxProps, Theme } from "@mui/material/styles";
import { Fragment } from "react";
import { getPermit } from "@/shared/hooks/usePermison";
export interface DataGridActionItem {
  label: string;
  loading?: boolean;
  elementId?: number;
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
  children?: React.ReactNode;
}

const DataGridActionBar = ({
  actions,
  size = "small",
  children,
}: DataGridActionBarProps) => {
  return (
    <Box display="flex" alignItems="center" gap={0.25}>
      {actions.map((action, index) => (
        <Fragment key={action.label}>
          {getPermit(action.elementId).canView && (
            <Button
              size={size}
              variant={action.variant ?? "text"}
              color={action.color ?? "primary"}
              startIcon={action.icon}
              disabled={action.disabled}
              sx={action.sx}
              onClick={action.onClick}
              loading={!!action.loading}
            >
              {action.label}
            </Button>
          )}
          {index < actions.length - 1 && (
            <Divider orientation="vertical" variant="middle" flexItem />
          )}
        </Fragment>
      ))}
      {children && (
        <Box display={"flex"} gap={0.25}>
          <Divider orientation="vertical" variant="middle" flexItem />
          {children}
        </Box>
      )}
    </Box>
  );
};

export default DataGridActionBar;
