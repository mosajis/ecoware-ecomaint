import TreeHeader from "./TreeHeader";
import TreeContent from "./TreeContent";
import { useTree } from "@headless-tree/react";
import { useEffect, useCallback, useState, useMemo, useRef } from "react";
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

  // ✅ Cache parent-child relationships for O(1) lookup
  const parentMap = useMemo(() => {
    const map = new Map<number, number>();
    childrenMap.forEach((children, parentId) => {
      children.forEach((childId) => {
        map.set(childId, parentId);
      });
    });
    return map;
  }, [childrenMap]);

  // ✅ Save previous expanded state
  const [previousExpandedItems, setPreviousExpandedItems] = useState<string[]>(
    [],
  );

  // ✅ هنگام تغییر داده‌ها، وضعیت expanded را ذخیره کنیم
  useEffect(() => {
    if (rootIds.length > 0) {
      // قبل از بارگذاری داده‌ها، وضعیت expandedItems رو ذخیره کنیم
      setPreviousExpandedItems(expandedItems);
      setExpandedItems(rootIds.map(String)); // ریشه‌ها رو باز کنیم
    }
  }, [rootIds]); // اگر rootIds تغییر کرد

  // ✅ زمانی که داده‌ها تغییر می‌کنند، وضعیت expandedItems را دوباره بازیابی کنیم
  useEffect(() => {
    if (rootIds.length > 0 && previousExpandedItems.length > 0) {
      setExpandedItems((prev) => {
        // اگر داده‌ها تغییر کرده باشند، وضعیت expandedItems رو از حافظه قبلی بازیابی کنیم
        const nextExpanded = [
          ...new Set([...previousExpandedItems, ...rootIds.map(String)]),
        ];
        return nextExpanded;
      });
    }
  }, [rootIds, previousExpandedItems]);

  const handleRefresh = useCallback(() => {
    // ابتدا داده‌ها را دوباره بارگذاری کن
    onRefresh?.();

    // پس از رفرش، اطمینان حاصل کن که expandedItems به روز می‌شود
    setExpandedItems((prev) => {
      // اگر ریشه‌ها تغییر کرده‌اند، وضعیت expandedItems را بازنشانی می‌کنیم
      if (rootIds.length !== prev.length) {
        return rootIds.map(String);
      }
      return prev;
    });
  }, [onRefresh, rootIds]);

  useEffect(() => {
    if (rootIds.length > 0) {
      // زمانی که داده‌ها بارگذاری می‌شوند، همه‌ی rootItems را expand کن
      setExpandedItems(rootIds.map(String));
    }
  }, [rootIds]); // اگر rootIds تغییر کند، expandedItems به روز می‌شود

  // ✅ Optimized getAncestorIds with O(log n) instead of O(n²)
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

  // ✅ Memoize valid IDs set
  const validIdsSet = useMemo(() => {
    return new Set(Array.from(itemsMap.keys()).map(String));
  }, [itemsMap]);

  // ✅ Clean up state when items are removed - optimized
  useEffect(() => {
    setExpandedItems((prev) => {
      const filtered = prev.filter((id) => validIdsSet.has(id));
      return filtered.length === prev.length ? prev : filtered;
    });

    setSelectedItems((prev) => {
      const filtered = prev.filter((id) => validIdsSet.has(id));
      return filtered.length === prev.length ? prev : filtered;
    });

    setFocusedItem((prev) => (prev && validIdsSet.has(prev) ? prev : null));
  }, [validIdsSet]);

  // ✅ Memoize tree configuration
  const treeConfig = useMemo(
    () => ({
      rootItemId: "root" as const,
      state: { selectedItems, expandedItems, focusedItem },
      setSelectedItems,
      setExpandedItems,
      setFocusedItem,
      getItemName: (item: any) => getItemName(item.getItemData()),
      isItemFolder: (item: any) => {
        const data = item.getItemData();
        if (!data) return false;

        const id = Number(getItemId(data));
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

  // ✅ Auto-expand root items - optimized
  useEffect(() => {
    if (!rootIds.length || expandedItems.length > 0) return;

    setExpandedItems(rootIds.map(String));
  }, [rootIds, expandedItems.length]);

  // ✅ Memoize tree items getter
  const getTreeItems = useCallback(() => tree.getItems(), [tree]);

  // ✅ Expand / Collapse all - optimized
  const handleExpandAll = useCallback(() => {
    const items = getTreeItems();
    items.forEach((item) => {
      if (item.isFolder()) item.expand();
    });
  }, [getTreeItems]);

  const handleCollapseAll = useCallback(() => {
    const items = getTreeItems();
    items.forEach((item) => item.collapse());
  }, [getTreeItems]);

  // ✅ Optimized handlers
  const handleEdit = useCallback(() => {
    const firstSelected = selectedItems[0];
    if (firstSelected) {
      onEdit?.(Number(firstSelected));
    }
  }, [selectedItems, onEdit]);

  const handleDelete = useCallback(() => {
    const firstSelected = selectedItems[0];
    if (firstSelected) {
      onDelete?.(Number(firstSelected));
    }
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

  // ✅ Heavily optimized search with early exits and batched updates
  const handleSearch = useCallback(
    (txt: string) => {
      const q = txt.trim().toLowerCase();

      if (!q) {
        setSearchQuery("");
        return;
      }

      setSearchQuery(q);

      const nextExpanded = new Set<string>();
      const itemsArray = Array.from(itemsMap.entries());

      // ✅ Single pass through items
      for (const [id, item] of itemsArray) {
        const name = getItemName(item).toLowerCase();
        if (!name.includes(q)) continue;

        const idStr = String(id);
        nextExpanded.add(idStr);

        // ✅ Add ancestors in one go
        const ancestors = getAncestorIds(id);
        ancestors.forEach((ancestorId) => nextExpanded.add(ancestorId));
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
        onDelete={handleDelete}
        onEdit={handleEdit}
        onAdd={onAdd}
        onRefresh={handleRefresh}
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
