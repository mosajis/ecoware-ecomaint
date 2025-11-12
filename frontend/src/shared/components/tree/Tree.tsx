import { Box, IconButton, Typography } from "@mui/material";
import {
  RichTreeView,
  TreeItem,
  type RichTreeViewProps,
} from "@mui/x-tree-view";
import CustomTreeItem from "./TreeItem";
import ExpandIcon from "@mui/icons-material/Expand";

interface TreeItem {
  id: string;
  label: string;
  children?: TreeItem[];
}

interface TreeProps extends RichTreeViewProps<TreeItem, false> {
  label?: string; // 👈 اضافه شد
}

export default function Tree({ items, label, ...other }: TreeProps) {
  const wrappedRoot: TreeItem = {
    id: "__root__",
    label: "_root_",
    children: [...(items ?? [])],
  };

  return (
    <Box
      sx={(theme) => ({
        height: "100%",
        border: `1px solid ${(theme.vars || theme).palette.divider}`,
        borderRadius: ` ${theme.shape.borderRadius}px `,
      })}
    >
      {label && (
        <Box
          sx={(theme) => ({
            padding: "6.5px 0.5rem",
            borderRadius: ` ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px  0 0`,
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

      <RichTreeView
        items={[wrappedRoot]}
        slots={{ item: CustomTreeItem }}
        defaultExpandedItems={["__root__"]}
        {...other}
      />
    </Box>
  );
}
