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
  extends Omit<RichTreeViewProps<TreeViewBaseItem, false>, "onSelect"> {
  label?: string;
  loading?: boolean;
  onRefresh?: () => void;
  toolbarActions?: ReactNode;
  onAddClick?: () => void;
  onEditClick?: (id: number) => void;
  onDeleteClick?: (id: string) => void;
  onItemSelect?: (id: string) => void; // نام متفاوت برای جلوگیری از conflict
}

export default function Tree({
  items,
  label,
  loading,
  toolbarActions,
  onRefresh,
  onAddClick,
  onEditClick,
  onDeleteClick,
  onItemSelect,
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
  const [selectedId, setSelectedId] = useState<string | null>(null);

  /** فیلتر فقط بر اساس سرچ */
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
    return filterNode(wrappedRoot) ?? { ...wrappedRoot, children: [] };
  }, [wrappedRoot, filterNode]);

  const [expandedItems, setExpandedItems] = useState<string[]>(["__root__"]);

  /** Expand خودکار هنگام سرچ */
  useEffect(() => {
    if (!searchText) return;

    const matchedIds: string[] = [];
    const walk = (node: TreeViewBaseItem) => {
      if (node.label.toLowerCase().includes(searchText.toLowerCase())) {
        matchedIds.push(node.id);
      }
      node.children?.forEach(walk);
    };

    walk(filteredTree);
    setExpandedItems(["__root__", ...matchedIds]);
  }, [searchText, filteredTree]);

  const allIds = useMemo(() => {
    const result: string[] = [];
    const walk = (node: TreeViewBaseItem) => {
      result.push(node.id);
      node.children?.forEach(walk);
    };
    walk(filteredTree);
    return result;
  }, [filteredTree]);

  const handleExpandAll = useCallback(() => setExpandedItems(allIds), [allIds]);
  const handleCollapseAll = useCallback(
    () => setExpandedItems(["__root__"]),
    []
  );

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
        {filteredTree.children && filteredTree.children.length > 0 ? (
          <RichTreeView
            items={[filteredTree]}
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
            selectedItems={selectedId}
            onSelectedItemsChange={(event, id) => {
              if (!id || id === "__root__") return;
              setSelectedId(id);
              onItemSelect?.(id);
            }}
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
