import { useState, useMemo, useCallback, ReactNode, useEffect } from "react";
import CustomTreeItem from "./TreeItem";
import TreeToolbar from "./TreeToolbar"; // Toolbar که قبلاً ساختیم
import { Box, LinearProgress, Typography } from "@mui/material";
import {
  RichTreeView,
  TreeViewBaseItem,
  type RichTreeViewProps,
} from "@mui/x-tree-view";

interface TreeProps extends RichTreeViewProps<TreeViewBaseItem, false> {
  label?: string;
  loading?: boolean;
  filterFn?: (node: TreeViewBaseItem) => boolean;
  toolbarActions?: ReactNode; // مثل DataGridActions
}

export default function Tree({
  items,
  label,
  loading,
  filterFn,
  onSelect,
  toolbarActions,
  ...other
}: TreeProps) {
  /** ریشه درخت */
  const wrappedRoot = useMemo<TreeViewBaseItem>(
    () => ({
      id: "__root__",
      label: label || "",
      children: [...(items ?? [])],
    }),
    [items, label]
  );

  const [searchText, setSearchText] = useState("");

  // filterFn را با سرچ ترکیب می‌کنیم
  const combinedFilterFn = useCallback(
    (node: TreeViewBaseItem) => {
      if (searchText) {
        return node.label.toLowerCase().includes(searchText.toLowerCase());
      }
      return true;
    },
    [searchText]
  );

  // filteredTree را بر اساس combinedFilterFn می‌سازیم
  const filteredTree = useMemo(() => {
    const filterNode = (node: TreeViewBaseItem): TreeViewBaseItem | null => {
      if (!node.children || node.children.length === 0) {
        return combinedFilterFn(node) ? { ...node } : null;
      }
      const filteredChildren = node.children
        .map(filterNode)
        .filter(Boolean) as TreeViewBaseItem[];
      if (filteredChildren.length > 0 || combinedFilterFn(node)) {
        return { ...node, children: filteredChildren };
      }
      return null;
    };
    return filterNode(wrappedRoot) ?? { ...wrappedRoot, children: [] };
  }, [wrappedRoot, combinedFilterFn]);

  useEffect(() => {
    if (!searchText) return;
    const matchedIds: string[] = [];
    const collectMatched = (node: TreeViewBaseItem) => {
      if (combinedFilterFn(node)) matchedIds.push(node.id);
      node.children?.forEach(collectMatched);
    };
    collectMatched(filteredTree);
    setExpandedItems(["__root__", ...matchedIds]); // parentها expand می‌شوند
  }, [searchText, filteredTree, combinedFilterFn]);

  /** استخراج تمام IDها */
  const allIds = useMemo(() => {
    const result: string[] = [];
    const walk = (node: TreeViewBaseItem) => {
      result.push(node.id);
      node.children?.forEach(walk);
    };
    walk(filteredTree);
    return result;
  }, [filteredTree]);

  const [expandedItems, setExpandedItems] = useState<string[]>(["__root__"]);

  const handleExpandAll = useCallback(() => setExpandedItems(allIds), [allIds]);
  const handleCollapseAll = useCallback(
    () => setExpandedItems(["__root__"]),
    []
  );

  const onExpandedChange = useCallback(
    (event: React.SyntheticEvent | null, itemIds: string[]) =>
      setExpandedItems(itemIds),
    []
  );

  /** پیدا کردن node واقعی با ID */
  const findNodeById = useCallback(
    (node: TreeViewBaseItem, id: string): TreeViewBaseItem | null => {
      if (node.id === id) return node;
      if (!node.children) return null;
      for (const child of node.children) {
        const result = findNodeById(child, id);
        if (result) return result;
      }
      return null;
    },
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
        onRefresh={console.log}
        onSearch={(value) => setSearchText(value)}
      />

      {loading && <LinearProgress />}

      <Box sx={{ flex: 1, overflow: "auto" }}>
        {filteredTree.children && filteredTree.children.length > 0 ? (
          <RichTreeView
            items={[filteredTree]}
            slots={{ item: CustomTreeItem }}
            expandedItems={expandedItems}
            onExpandedItemsChange={onExpandedChange}
            defaultExpandedItems={["__root__"]}
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
