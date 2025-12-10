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
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import LinearProgress from "@mui/material/LinearProgress";

interface DataGridToolbarProps {
  label: string;
  loading?: boolean;
  onAddClick?: () => void;
  onRefreshClick?: () => void;

  disableSearch?: boolean;
  disableDensity?: boolean;
  disableExport?: boolean;
  disableColumns?: boolean;
  disableFilters?: boolean;
  disableAdd?: boolean;
  disableRefresh?: boolean;

  children?: React.ReactNode; // <-- اضافه شد
}

export default function DataGridToolbar(props: DataGridToolbarProps) {
  const theme = useTheme();

  const {
    label,
    loading,
    onAddClick,
    onRefreshClick,
    disableSearch,
    disableDensity,
    disableExport,
    disableColumns,
    disableFilters,
    disableAdd,
    disableRefresh,
    children, // <-- اضافه شد
  } = props;

  return (
    <Box sx={{ width: "100%" }}>
      <Toolbar
        style={{
          display: "flex",
          paddingLeft: ".5rem",
          justifyContent: "space-between",
          borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
        }}
      >
        <Box display={"flex"} alignItems={"center"} gap={2}>
          <Typography fontWeight="bold">{label}</Typography>

          {/* 🔥 children اینجا رندر می‌شود */}
          {children}
        </Box>

        <Box display="flex" gap={0.5}>
          {!disableSearch && <ButtonSearch />}
          {!disableDensity && <ButtonDensity />}
          {!disableExport && <ButtonExport />}
          {!disableColumns && <ButtonColumns />}
          {!disableFilters && <ButtonFilters />}
          {!disableRefresh && onRefreshClick && (
            <ToolbarButton title="Refresh" onClick={onRefreshClick}>
              <RefreshIcon />
            </ToolbarButton>
          )}
          {!disableAdd && onAddClick && (
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
