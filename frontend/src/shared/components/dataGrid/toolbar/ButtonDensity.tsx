import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CheckIcon from "@mui/icons-material/Check";
import DensityLargeIcon from "@mui/icons-material/DensityLarge";
import DensityMediumIcon from "@mui/icons-material/DensityMedium";
import DensitySmallIcon from "@mui/icons-material/DensitySmall";
import {
  GridDensity,
  ToolbarButton,
  useGridApiContext,
  useGridSelector,
  gridDensitySelector,
} from "@mui/x-data-grid";
import { useRef, useState } from "react";

const DENSITY_OPTIONS: {
  label: string;
  value: GridDensity;
  icon: any;
}[] = [
  {
    label: "Compact density",
    value: "compact",
    icon: <DensitySmallIcon fontSize="small" />,
  },
  {
    label: "Standard density",
    value: "standard",
    icon: <DensityMediumIcon fontSize="small" />,
  },
  {
    label: "Comfortable density",
    value: "comfortable",
    icon: <DensityLargeIcon fontSize="small" />,
  },
];

export default function ButtonDensity() {
  const apiRef = useGridApiContext();
  const density = useGridSelector(apiRef, gridDensitySelector);
  const [densityMenuOpen, setDensityMenuOpen] = useState(false);
  const densityMenuTriggerRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <Tooltip title="Density">
        <ToolbarButton
          size="small"
          ref={densityMenuTriggerRef}
          onClick={() => setDensityMenuOpen(true)}
        >
          {DENSITY_OPTIONS.find((opt) => opt.value === density)?.icon || (
            <DensitySmallIcon fontSize="small" /> // compact پیش‌فرض
          )}
        </ToolbarButton>
      </Tooltip>

      <Menu
        anchorEl={densityMenuTriggerRef.current}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={densityMenuOpen}
        onClose={() => setDensityMenuOpen(false)}
        slotProps={{
          list: { "aria-labelledby": "density-menu-trigger" },
        }}
      >
        {DENSITY_OPTIONS.map((option) => (
          <MenuItem
            key={option.value}
            onClick={() => {
              apiRef.current.setDensity(option.value);
              setDensityMenuOpen(false);
            }}
          >
            <ListItemIcon>
              {density === option.value && <CheckIcon fontSize="small" />}
            </ListItemIcon>
            <ListItemText>{option.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
