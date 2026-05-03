import TreeHeader from "./TreeHeader";
import TreeContent from "./TreeContent";
import { useTree } from "@headless-tree/react";
import { useEffect, useCallback, useState, useMemo, useRef } from "react";
import { TreeDataMapper } from "@/shared/hooks/useDataTree";
import {
  syncDataLoaderFeature,
  selectionFeature,
  hotkeysCoreFeature,
} from "@headless-tree/core";

import "./tree.css";
import { usePermission } from "@/shared/hooks/usePermison";

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
  elementId?: number;
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
  elementId,
}: GenericTreeProps<T>) {
  let { canCreate, canUpdate, canDelete, canView, canExport } = usePermission(
    elementId!,
  );

  if (!elementId) {
    canCreate = true;
    canUpdate = true;
    canView = true;
    canExport = true;
  }

  if (!canView) return;

  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [focusedItem, setFocusedItem] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const initializedRef = useRef(false);
  const prevItemsSizeRef = useRef(0);
  const clickTimerRef = useRef<number | null>(null);
  const CLICK_DELAY = 200;

  const { itemsMap, childrenMap, rootIds } = data;

  // ✅ فقط اولین بار که rootIds می‌آد expand کن
  useEffect(() => {
    if (rootIds.length > 0 && !initializedRef.current) {
      setExpandedItems(rootIds.map(String));
      initializedRef.current = true;
      prevItemsSizeRef.current = itemsMap.size;
    }
  }, [rootIds]);

  // ✅ بعد از CRUD داده آپدیت میشه — expanded کاربر حفظ میشه
  // فقط root های جدید اضافه میشن و invalid ids پاک میشن
  useEffect(() => {
    if (!initializedRef.current) return;
    if (itemsMap.size === prevItemsSizeRef.current) return;

    prevItemsSizeRef.current = itemsMap.size;

    const validIds = new Set(Array.from(itemsMap.keys()).map(String));

    setExpandedItems((prev) => {
      const cleaned = prev.filter((id) => validIds.has(id));
      const newRoots = rootIds
        .map(String)
        .filter((id) => !cleaned.includes(id));
      return newRoots.length > 0 ? [...cleaned, ...newRoots] : cleaned;
    });

    setSelectedItems((prev) => prev.filter((id) => validIds.has(id)));
    setFocusedItem((prev) => (prev && validIds.has(prev) ? prev : null));
  }, [itemsMap, rootIds]);

  // ✅ Parent map for ancestor lookup
  const parentMap = useMemo(() => {
    const map = new Map<number, number>();
    childrenMap.forEach((children, parentId) => {
      children.forEach((childId) => map.set(childId, parentId));
    });
    return map;
  }, [childrenMap]);

  const getAncestorIds = useCallback(
    (id: number): string[] => {
      const result: string[] = [];
      let currentId: number | undefined = id;
      while (currentId != null) {
        const parentId = parentMap.get(currentId);
        if (parentId == null) break;
        result.push(String(parentId));
        currentId = parentId;
      }
      return result;
    },
    [parentMap],
  );

  const treeConfig = useMemo(
    () => ({
      rootItemId: "root" as const,
      state: { selectedItems, expandedItems, focusedItem },
      setSelectedItems,
      setExpandedItems,
      setFocusedItem,
      getItemName: (item: any) => getItemName(item.getItemData()),
      isItemFolder: (item: any) => {
        const d = item.getItemData();
        if (!d) return false;
        const id = Number(getItemId(d));
        if (Number.isNaN(id)) return false;
        return (childrenMap.get(id)?.length ?? 0) > 0;
      },
      dataLoader: {
        getItem: (itemId: string) => {
          if (itemId === "root") return {} as T;
          return itemsMap.get(Number(itemId)) || ({ id: itemId } as T);
        },
        getChildren: (itemId: string) => {
          if (itemId === "root") return rootIds.map(String);
          const children = childrenMap.get(Number(itemId)) || [];
          return children.filter((id) => itemsMap.has(id)).map(String);
        },
      },
      features: [syncDataLoaderFeature, selectionFeature, hotkeysCoreFeature],
    }),
    [
      selectedItems,
      expandedItems,
      focusedItem,
      getItemName,
      getItemId,
      childrenMap,
      itemsMap,
      rootIds,
    ],
  );

  const tree = useTree<T>(treeConfig);

  const getTreeItems = useCallback(() => tree.getItems(), [tree]);

  const handleExpandAll = useCallback(() => {
    getTreeItems().forEach((item) => {
      if (item.isFolder()) item.expand();
    });
  }, [getTreeItems]);

  const handleCollapseAll = useCallback(() => {
    getTreeItems().forEach((item) => item.collapse());
  }, [getTreeItems]);

  const handleEdit = useCallback(() => {
    const firstSelected = selectedItems[0];
    if (firstSelected) onEdit?.(Number(firstSelected));
  }, [selectedItems, onEdit]);

  const handleDelete = useCallback(() => {
    const firstSelected = selectedItems[0];
    if (firstSelected) onDelete?.(Number(firstSelected));
  }, [selectedItems, onDelete]);

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

  const handleSearch = useCallback(
    (txt: string) => {
      const q = txt.trim().toLowerCase();

      if (!q) {
        setSearchQuery("");
        return;
      }

      setSearchQuery(q);

      const nextExpanded = new Set<string>();

      for (const [id, item] of Array.from(itemsMap.entries())) {
        const name = getItemName(item).toLowerCase();
        if (!name.includes(q)) continue;
        nextExpanded.add(String(id));
        getAncestorIds(id).forEach((ancestorId) =>
          nextExpanded.add(ancestorId),
        );
      }

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
        onDelete={canDelete ? handleDelete : undefined}
        onEdit={canUpdate ? handleEdit : undefined}
        onAdd={canCreate ? onAdd : undefined}
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
