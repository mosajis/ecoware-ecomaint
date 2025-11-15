import { Box, IconButton, Typography, LinearProgress } from "@mui/material";
import {
  RichTreeView,
  TreeItem,
  TreeViewBaseItem,
  type RichTreeViewProps,
} from "@mui/x-tree-view";
import CustomTreeItem from "./TreeItem";
import ExpandIcon from "@mui/icons-material/Expand";

interface TreeProps extends RichTreeViewProps<TreeViewBaseItem, false> {
  label?: string;
  loading?: boolean; // اضافه شد
}

export default function Tree({ items, label, loading, ...other }: TreeProps) {
  const wrappedRoot: TreeViewBaseItem = {
    id: "__root__",
    label: label || "",
    children: [...(items ?? [])],
  };

  return (
    <Box
      sx={(theme) => ({
        overflow: "auto",
        height: "100%",
        border: `1px solid ${(theme.vars || theme).palette.divider}`,
        borderRadius: `${theme.shape.borderRadius}px`,
        position: "relative",
      })}
    >
      {label && (
        <Box
          sx={(theme) => ({
            padding: "7.5px 0.5rem",
            borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
            backgroundColor: (theme.vars || theme).palette.background.paper,
            borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          })}
        >
          <Typography fontWeight="bold">{label}</Typography>
          <Box>
            <IconButton size="small">
              <ExpandIcon />
            </IconButton>
          </Box>
        </Box>
      )}

      {loading ? (
        <LinearProgress /> // یا هر loader دلخواه
      ) : items && items.length > 0 ? (
        <RichTreeView
          items={[wrappedRoot]}
          slots={{ item: CustomTreeItem }}
          defaultExpandedItems={["__root__"]}
          {...other}
        />
      ) : (
        <Box textAlign="center" p={2} color="text.secondary">
          NotFound
        </Box>
      )}
    </Box>
  );
}
