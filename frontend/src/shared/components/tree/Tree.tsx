import TreeHeader from "./TreeHeader";
import TreeContent from "./TreeContent";
import { useTree } from "@headless-tree/react";
import { useEffect, useCallback, useState } from "react";
import { useRef } from "react";
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

  const [searchQuery, setSearchQuery] = useState("");

  const { itemsMap, childrenMap, rootIds } = data;

  const clickTimerRef = useRef<number | null>(null);
  const CLICK_DELAY = 200;

  const handleItemClick = useCallback(
    (item: T) => {
      if (clickTimerRef.current) return;

      clickTimerRef.current = window.setTimeout(() => {
        clickTimerRef.current = null;
        onItemSelect?.(item);
      }, CLICK_DELAY);
    },
    [onItemSelect],
  );

  const handleItemDoubleClick = useCallback(
    (itemId: number) => {
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
        clickTimerRef.current = null;
      }

      onDoubleClick?.(itemId);
    },
    [onDoubleClick],
  );

  const getAncestorIds = useCallback(
    (id: number) => {
      const result: string[] = [];
      let currentId: number | undefined = id;

      while (currentId != null) {
        const parentEntry = Array.from(childrenMap.entries()).find(
          ([, children]) => children.includes(currentId!),
        );

        if (!parentEntry) break;

        const parentId = parentEntry[0];
        result.push(String(parentId));
        currentId = parentId;
      }

      return result;
    },
    [childrenMap],
  );

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
      const data = item.getItemData();
      if (!data) return false;

      const id = Number(getItemId(data));
      if (Number.isNaN(id)) return false;

      return (childrenMap.get(id)?.length ?? 0) > 0;
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

  // Auto-expand root items
  useEffect(() => {
    if (!rootIds.length) return;

    setExpandedItems((prev) => {
      if (prev.length > 0) return prev;

      return rootIds.map(String);
    });
  }, [rootIds]);

  // Expand / Collapse all
  const handleExpandAll = useCallback(() => {
    tree.getItems().forEach((item) => {
      if (item.isFolder()) item.expand();
    });
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

  const handleSearch = useCallback(
    (txt: string) => {
      const q = txt.trim().toLowerCase();

      if (!q) {
        setSearchQuery("");

        return;
      }

      setSearchQuery(q);

      const nextExpanded = new Set<string>();
      const nextHighlighted = new Set<string>();

      itemsMap.forEach((item, id) => {
        const name = getItemName(item).toLowerCase();
        if (!name.includes(q)) return;

        const idStr = String(id);
        nextHighlighted.add(idStr);
        nextExpanded.add(idStr);

        getAncestorIds(id).forEach((ancestorId) =>
          nextExpanded.add(ancestorId),
        );
      });

      if (nextExpanded.size > 0) {
        setExpandedItems(Array.from(nextExpanded));
      }
    },
    [itemsMap, getItemName, getAncestorIds],
  );

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
        searchQuery={searchQuery}
        onItemClick={handleItemClick}
        onItemDoubleClick={handleItemDoubleClick}
        getItemName={getItemName}
        getItemId={getItemId}
      />
    </div>
  );
}
