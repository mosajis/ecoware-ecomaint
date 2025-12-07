import { useState, useMemo, useCallback, ReactNode, useEffect } from "react";
import CustomTreeItem from "./CustomeTreeItem";
import TreeToolbar from "./TreeToolbar";
import ConfirmDialog from "@/shared/components/ConfirmDialog";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import {
  RichTreeView,
  TreeViewBaseItem,
  type RichTreeViewProps,
} from "@mui/x-tree-view";

interface CustomizedTreeProps<T = any> {
  label?: string;
  loading?: boolean;
  onRefresh?: () => void;
  toolbarActions?: ReactNode;
  onAddClick?: () => void;
  onEditClick?: (row: T) => void;
  onDeleteClick?: (row: T) => void;
  getRowId?: (row: T) => string | number;
  items?: (TreeViewBaseItem & { data?: T })[];
  [key: string]: any;
}

export default function CustomizedTree<T = any>({
  items = [],
  label,
  loading,
  toolbarActions,
  onRefresh,
  onAddClick,
  onEditClick,
  onDeleteClick,
  getRowId,
  ...other
}: CustomizedTreeProps<T>) {
  const [searchText, setSearchText] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<T | null>(null);

  // Helper تابع برای گرفتن ID از نود
  const getNodeId = useCallback(
    (node: TreeViewBaseItem & { data?: T }): string => {
      if (node.data && getRowId) {
        return String(getRowId(node.data));
      }
      return String(node.id);
    },
    [getRowId]
  );

  const filterNode = useCallback(
    (
      node: TreeViewBaseItem & { data?: T }
    ): (TreeViewBaseItem & { data?: T }) | null => {
      const match = node.label.toLowerCase().includes(searchText.toLowerCase());
      if (!node.children || node.children.length === 0)
        return match ? { ...node } : null;
      const filteredChildren = node.children
        .map(filterNode)
        .filter(Boolean) as (TreeViewBaseItem & { data?: T })[];
      return filteredChildren.length > 0 || match
        ? { ...node, children: filteredChildren }
        : null;
    },
    [searchText]
  );

  const filteredTree = useMemo(
    () =>
      items.map(filterNode).filter(Boolean) as (TreeViewBaseItem & {
        data?: T;
      })[],
    [items, filterNode]
  );

  // ساخت Map برای دسترسی سریع به نودها با ID
  const flatNodes = useMemo(() => {
    const map = new Map<string, TreeViewBaseItem & { data?: T }>();
    const walk = (node: TreeViewBaseItem & { data?: T }) => {
      const id = getNodeId(node);
      map.set(id, node);
      node.children?.forEach(walk);
    };
    filteredTree.forEach(walk);
    return map;
  }, [filteredTree, getNodeId]);

  const handleConfirmDelete = useCallback(() => {
    if (deleteTarget && onDeleteClick) {
      onDeleteClick(deleteTarget);
    }
    setConfirmOpen(false);
    setDeleteTarget(null);
  }, [deleteTarget, onDeleteClick]);

  const handleCancelDelete = useCallback(() => {
    setConfirmOpen(false);
    setDeleteTarget(null);
  }, []);

  // Expand management
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const allIds = useMemo(() => {
    const result: string[] = [];
    const walk = (node: TreeViewBaseItem & { data?: T }) => {
      result.push(getNodeId(node));
      node.children?.forEach(walk);
    };
    filteredTree.forEach(walk);
    return result;
  }, [filteredTree, getNodeId]);

  const handleExpandAll = useCallback(() => setExpandedItems(allIds), [allIds]);
  const handleCollapseAll = useCallback(() => setExpandedItems([]), []);
  const onExpandedChange = useCallback(
    (_e: any, ids: string[]) => setExpandedItems(ids),
    []
  );

  useEffect(() => {
    if (!searchText) return;
    const matches: string[] = [];
    const walk = (node: TreeViewBaseItem & { data?: T }) => {
      if (node.label.toLowerCase().includes(searchText.toLowerCase())) {
        matches.push(getNodeId(node));
      }
      node.children?.forEach(walk);
    };
    filteredTree.forEach(walk);
    setExpandedItems(matches);
  }, [searchText, filteredTree, getNodeId]);

  return (
    <>
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
              items={filteredTree.map((node) => ({
                ...node,
                id: getNodeId(node),
              }))}
              slots={{
                item: (props: any) => (
                  <CustomTreeItem
                    {...props}
                    onEditClick={(id: string) => {
                      const node = flatNodes.get(id);
                      if (node?.data) {
                        onEditClick?.(node.data);
                      }
                    }}
                    onDeleteClick={(id: string) => {
                      const node = flatNodes.get(id);
                      if (node?.data) {
                        setDeleteTarget(node.data);
                        setConfirmOpen(true);
                      }
                    }}
                  />
                ),
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

      <ConfirmDialog
        open={confirmOpen}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Item"
        message="Are you sure you want to delete this item?"
      />
    </>
  );
}
