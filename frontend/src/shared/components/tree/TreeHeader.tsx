import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import TreeToolbar from "./TreeToolbar";
import { memo } from "react";

interface TreeHeaderProps {
  loading?: boolean;
  label: string;
  onAdd?: () => void;
  onRefresh?: () => void;
  onExpandAll?: () => void;
  onCollapseAll?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  onSearchApply: (txt: string) => void;
  onSearchCancel: () => void;
  hasSelection?: boolean;
}

const TreeHeader = memo(function TreeHeader({
  loading,
  label,
  hasSelection,
  ...handlers
}: TreeHeaderProps) {
  return (
    <Box>
      <TreeToolbar label={label} hasSelection={hasSelection} {...handlers} />
      {loading && <LinearProgress />}
    </Box>
  );
});

export default TreeHeader;
