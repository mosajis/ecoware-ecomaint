import Badge from "@mui/material/Badge";
import Tooltip from "@mui/material/Tooltip";
import { FilterPanelTrigger, ToolbarButton } from "@mui/x-data-grid";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

export default function ButtonFilters() {
  return (
    <Tooltip title="Filters">
      <FilterPanelTrigger
        size="small"
        render={(props, state) => (
          <Badge
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            badgeContent={state.filterCount}
            color="primary"
            variant="dot"
          >
            <ToolbarButton {...props} color="default">
              <FilterAltIcon />
            </ToolbarButton>
          </Badge>
        )}
      />
    </Tooltip>
  );
}
