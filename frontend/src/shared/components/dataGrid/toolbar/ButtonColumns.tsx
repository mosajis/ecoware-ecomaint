import React from "react";
import {
  ColumnsPanelTrigger,
  FilterPanelTrigger,
  ToolbarButton,
} from "@mui/x-data-grid";
import { Tooltip, Badge } from "@mui/material";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";

import {
  useGridApiContext,
  useGridSelector,
  gridColumnVisibilityModelSelector,
} from "@mui/x-data-grid";

export default function ButtonColumns() {
  const apiRef = useGridApiContext();
  const columnVisibilityModel = useGridSelector(
    apiRef,
    gridColumnVisibilityModelSelector
  );

  // تعداد ستون‌های مخفی
  const hiddenCount = Object.values(columnVisibilityModel).filter(
    (v) => v === false
  ).length;

  return (
    <Tooltip title="Columns">
      <ColumnsPanelTrigger
        render={(props, state) => (
          <Badge
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            badgeContent={hiddenCount > 0 ? hiddenCount : undefined} // فقط اگر ستون مخفی داریم نمایش بده
            color="primary"
          >
            <ToolbarButton {...props} color="default" size="small">
              <ViewColumnIcon fontSize="small" />
            </ToolbarButton>
          </Badge>
        )}
      />
    </Tooltip>
  );
}

export { ButtonColumns };
