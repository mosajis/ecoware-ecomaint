import TreeHeader from "./TreeHeader";
import TreeContent from "./TreeContent";
import { useTree } from "@headless-tree/react";
import { useEffect, useCallback, useState } from "react";
import { TreeDataMapper } from "@/shared/hooks/useDataTree";
import {
  syncDataLoaderFeature,
  selectionFeature,
  hotkeysCoreFeature,
  TreeState,
} from "@headless-tree/core";

import "./tree.css";

interface GenericTreeProps<T> {
  label?: string;
  data: TreeDataMapper<T>;
  onDoubleClick?: (rowId: number) => void;
  onItemSelect?: (item: T) => void;
  getItemName: (item: T) => string;
  getItemId: (item: T) => string | number;
  onAdd?: () => void;
  onRefresh?: () => void;
  onEdit?: (itemId: number) => void;
  onDelete?: (itemId: number) => void;
  loading?: boolean;
  initialState?: Partial<TreeState<T>>;
}

export function GenericTree<T>({
  label,
  data,
  onDelete,
  onEdit,
  onItemSelect,
  getItemName,
  getItemId,
  onAdd,
  onRefresh,
  onDoubleClick,
  loading = false,
}: GenericTreeProps<T>) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [focusedItem, setFocusedItem] = useState<string | null>(null);

  const { itemsMap, childrenMap, rootIds } = data;

  // Clean up state when items are removed
  useEffect(() => {
    const validIds = new Set(Array.from(itemsMap.keys()).map(String));
    setExpandedItems((prev) => prev.filter((id) => validIds.has(id)));
    setSelectedItems((prev) => prev.filter((id) => validIds.has(id)));
    setFocusedItem((prev) => (prev && validIds.has(prev) ? prev : null));
  }, [itemsMap]);

  const tree = useTree<T>({
    rootItemId: "root",
    state: { selectedItems, expandedItems, focusedItem },
    setSelectedItems,
    setExpandedItems,
    setFocusedItem,
    getItemName: (item) => getItemName(item.getItemData()),
    isItemFolder: (item) => {
      try {
        const id = getItemId(item.getItemData());
        return (childrenMap.get(Number(id))?.length ?? 0) > 0;
      } catch {
        return false;
      }
    },
    dataLoader: {
      getItem: (itemId) => {
        if (itemId === "root") return {} as T;
        return itemsMap.get(Number(itemId)) || ({ id: itemId } as T);
      },
      getChildren: (itemId) => {
        if (itemId === "root") return rootIds.map(String);
        return (childrenMap.get(Number(itemId)) || [])
          .filter((id) => itemsMap.has(id))
          .map(String);
      },
    },
    features: [syncDataLoaderFeature, selectionFeature, hotkeysCoreFeature],
  });

  // Rebuild tree when items change
  useEffect(() => {
    tree.rebuildTree();
  }, [itemsMap, childrenMap, rootIds, tree]);

  // Auto-expand root items
  useEffect(() => {
    if (!rootIds.length) return;
    setExpandedItems((prev) => {
      const next = new Set(prev);
      rootIds.forEach((id) => next.add(String(id)));
      return Array.from(next);
    });
  }, [rootIds]);

  // Expand / Collapse all
  const handleExpandAll = useCallback(() => {
    tree.getItems().forEach((item) => item.expand());
  }, [tree]);

  const handleCollapseAll = useCallback(() => {
    tree.getItems().forEach((item) => item.collapse());
  }, [tree]);

  // Only send ID for edit/delete for performance
  const handleEdit = useCallback(() => {
    if (!selectedItems[0]) return;
    onEdit?.(Number(selectedItems[0]));
  }, [selectedItems, onEdit]);

  const handleDelete = useCallback(() => {
    if (!selectedItems[0]) return;
    onDelete?.(Number(selectedItems[0]));
  }, [selectedItems, onDelete]);

  const handleSearch = () => {
    console.log("search");
  };

  return (
    <div className="tree-container">
      <TreeHeader
        label={label || "Tree View"}
        onSearch={handleSearch}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onAdd={onAdd}
        onRefresh={onRefresh}
        onExpandAll={handleExpandAll}
        onCollapseAll={handleCollapseAll}
        loading={loading}
        hasSelection={selectedItems.length > 0}
      />
      <TreeContent
        tree={tree}
        rootIds={rootIds}
        onDoubleClick={onDoubleClick}
        getItemName={getItemName}
        getItemId={getItemId}
        onItemSelect={onItemSelect}
      />
    </div>
  );
}
