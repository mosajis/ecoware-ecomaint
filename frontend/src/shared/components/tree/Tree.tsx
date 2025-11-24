import { useState, useMemo, useCallback, ReactNode, useEffect } from "react";
import CustomTreeItem from "./TreeItem";
import TreeToolbar from "./TreeToolbar";
import { Box, LinearProgress } from "@mui/material";
import {
  RichTreeView,
  TreeViewBaseItem,
  type RichTreeViewProps,
} from "@mui/x-tree-view";

interface TreeProps
  extends Omit<RichTreeViewProps<TreeViewBaseItem, false>, ""> {
  label?: string;
  loading?: boolean;
  onRefresh?: () => void;
  toolbarActions?: ReactNode;
  onAddClick?: () => void;
  onEditClick?: (id: number) => void;
  onDeleteClick?: (id: number) => void;
}

export default function Tree({
  items = [],
  label,
  loading,
  toolbarActions,
  onRefresh,
  onAddClick,
  onEditClick,
  onDeleteClick,
  ...other
}: TreeProps) {
  const [searchText, setSearchText] = useState("");

  /** سرچ روی درخت */
  const filterNode = useCallback(
    (node: TreeViewBaseItem): TreeViewBaseItem | null => {
      const match = node.label.toLowerCase().includes(searchText.toLowerCase());

      if (!node.children || node.children.length === 0) {
        return match ? { ...node } : null;
      }

      const filteredChildren = node.children
        .map(filterNode)
        .filter(Boolean) as TreeViewBaseItem[];

      if (filteredChildren.length > 0 || match) {
        return { ...node, children: filteredChildren };
      }
      return null;
    },
    [searchText]
  );

  const filteredTree = useMemo(() => {
    return items.map(filterNode).filter(Boolean) as TreeViewBaseItem[];
  }, [items, filterNode]);

  /** مدیریت expand‌ها */
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  /** auto-expand در حالت سرچ */
  useEffect(() => {
    if (!searchText) return;

    const matches: string[] = [];

    const walk = (node: TreeViewBaseItem) => {
      if (node.label.toLowerCase().includes(searchText.toLowerCase())) {
        matches.push(node.id);
      }
      node.children?.forEach(walk);
    };

    filteredTree.forEach(walk);
    setExpandedItems(matches);
  }, [searchText, filteredTree]);

  /** گرفتن همه IDها برای expandAll */
  const allIds = useMemo(() => {
    const result: string[] = [];

    const walk = (node: TreeViewBaseItem) => {
      result.push(node.id);
      node.children?.forEach(walk);
    };

    filteredTree.forEach(walk);
    return result;
  }, [filteredTree]);

  const handleExpandAll = useCallback(() => setExpandedItems(allIds), [allIds]);
  const handleCollapseAll = useCallback(() => setExpandedItems([]), []);
  const onExpandedChange = useCallback(
    (event: React.SyntheticEvent | null, ids: string[]) =>
      setExpandedItems(ids),
    []
  );

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
        overflow: "hidden",
      }}
    >
      <TreeToolbar
        label={label}
        onExpandAll={handleExpandAll}
        onCollapseAll={handleCollapseAll}
        actions={toolbarActions}
        onRefresh={onRefresh}
        onSearch={setSearchText}
        onAdd={onAddClick}
      />

      {loading && <LinearProgress />}

      <Box sx={{ flex: 1, overflow: "auto" }}>
        {filteredTree.length > 0 ? (
          <RichTreeView
            items={filteredTree}
            slots={{ item: CustomTreeItem }}
            slotProps={{
              item: {
                // @ts-ignore
                onEditClick: onEditClick,
                onDeleteClick: onDeleteClick,
              },
            }}
            expandedItems={expandedItems}
            onExpandedItemsChange={onExpandedChange}
            {...other}
          />
        ) : (
          <Box textAlign="center" p={2} color="text.secondary">
            NotFound
          </Box>
        )}
      </Box>
    </Box>
  );
}
