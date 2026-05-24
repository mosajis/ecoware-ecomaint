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
import { getPermit } from "@/shared/hooks/usePermison";

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
  // ✅ اصلاح: permission logic درست
  const defaultPermissions = {
    canCreate: true,
    canUpdate: true,
    canDelete: true,
    canView: true,
    canExport: true,
  };

  const permissions = elementId ? getPermit(elementId) : defaultPermissions;

  const { canCreate, canUpdate, canDelete, canView, canExport } = permissions;

  if (!canView) return null;

  // ✅ States
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [focusedItem, setFocusedItem] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Refs
  const clickTimerRef = useRef<number | null>(null);
  const dataHashRef = useRef<string>("");
  const CLICK_DELAY = 200;

  const { itemsMap, childrenMap, rootIds } = data;

  // ✅ Parent map برای ancestor lookup
  const parentMap = useMemo(() => {
    const map = new Map<number, number>();
    childrenMap.forEach((children, parentId) => {
      children.forEach((childId) => map.set(childId, parentId));
    });
    return map;
  }, [childrenMap]);

  // ✅ تشخیص تغییر در data (مقایسه هش)
  const dataHash = useMemo(() => {
    return `${itemsMap.size}-${rootIds.length}-${childrenMap.size}`;
  }, [itemsMap, rootIds, childrenMap]);

  // ✅ اولین initialize - expand کردن root items
  useEffect(() => {
    if (rootIds.length === 0) {
      setExpandedItems([]);
      setSelectedItems([]);
      setFocusedItem(null);
      dataHashRef.current = dataHash;
      return;
    }

    // اگر این اولین بار است
    if (dataHashRef.current === "") {
      setExpandedItems(rootIds.map(String));
      dataHashRef.current = dataHash;
      return;
    }

    // اگر data تغییر کرده است (add/update/delete)
    if (dataHashRef.current !== dataHash) {
      setExpandedItems((prev) => {
        const validIds = new Set(Array.from(itemsMap.keys()).map(String));

        // حفظ expanded items که هنوز موجود اند
        const cleaned = prev.filter((id) => validIds.has(id));

        // اضافه کردن root های جدید
        const newRoots = rootIds
          .map(String)
          .filter((id) => !cleaned.includes(id));

        return [...cleaned, ...newRoots];
      });

      // تمیزکاری selected items
      setSelectedItems((prev) => {
        const validIds = new Set(Array.from(itemsMap.keys()).map(String));
        return prev.filter((id) => validIds.has(id));
      });

      // تمیزکاری focused item
      setFocusedItem((prev) => {
        const validIds = new Set(Array.from(itemsMap.keys()).map(String));
        return prev && validIds.has(prev) ? prev : null;
      });

      dataHashRef.current = dataHash;
    }
  }, [dataHash, rootIds, itemsMap]);

  // ✅ حل memory leak - cleanup timeout در unmount
  useEffect(() => {
    return () => {
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
      }
    };
  }, []);

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

  // ✅ Tree config - بهتر شده
  const treeConfig = useMemo(
    () => ({
      rootItemId: "root" as const,
      state: { selectedItems, expandedItems, focusedItem },
      setSelectedItems,
      setExpandedItems,
      setFocusedItem,
      getItemName: (item: any) => {
        const data = item.getItemData();
        return data ? getItemName(data) : "";
      },
      isItemFolder: (item: any) => {
        const d = item.getItemData();
        if (!d) return false;
        const id = Number(getItemId(d));
        if (Number.isNaN(id)) return false;
        const children = childrenMap.get(id) || [];
        return children.length > 0;
      },
      dataLoader: {
        getItem: (itemId: string) => {
          if (itemId === "root") return {} as T;
          const item = itemsMap.get(Number(itemId));
          return item || ({ id: itemId } as T);
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

  // ✅ Handlers - بهتر شده

  const handleExpandAll = useCallback(() => {
    const items = tree.getItems();
    items.forEach((item) => {
      if (item.isFolder()) {
        item.expand();
      }
    });
  }, [tree]);

  const handleCollapseAll = useCallback(() => {
    const items = tree.getItems();
    items.forEach((item) => {
      item.collapse();
    });
  }, [tree]);

  const handleEdit = useCallback(() => {
    const firstSelected = selectedItems[0];
    if (firstSelected && onEdit) {
      onEdit(Number(firstSelected));
    }
  }, [selectedItems, onEdit]);

  const handleDelete = useCallback(() => {
    const firstSelected = selectedItems[0];
    if (firstSelected && onDelete) {
      onDelete(Number(firstSelected));
    }
  }, [selectedItems, onDelete]);

  const handleItemClick = useCallback(
    (item: T) => {
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
      }

      clickTimerRef.current = window.setTimeout(() => {
        clickTimerRef.current = null;
        if (onItemSelect) {
          onItemSelect(item);
        }
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
      if (onDoubleClick) {
        onDoubleClick(itemId);
      }
    },
    [onDoubleClick],
  );

  const handleSearch = useCallback(
    (txt: string) => {
      const q = txt.trim().toLowerCase();

      if (!q) {
        setSearchQuery("");
        setExpandedItems((prev) => {
          // بازگرداندن به حالت بدون search
          const validIds = new Set(Array.from(itemsMap.keys()).map(String));
          return prev.filter((id) => validIds.has(id));
        });
        return;
      }

      setSearchQuery(q);

      const nextExpanded = new Set<string>();

      for (const [id, item] of Array.from(itemsMap.entries())) {
        const name = getItemName(item).toLowerCase();
        if (!name.includes(q)) continue;

        nextExpanded.add(String(id));
        getAncestorIds(id).forEach((ancestorId) => {
          nextExpanded.add(ancestorId);
        });
      }

      if (nextExpanded.size > 0) {
        setExpandedItems(Array.from(nextExpanded));
      } else {
        // اگر نتیجه‌ای نیافت، حداقل root ها باز باشن
        setExpandedItems(rootIds.map(String));
      }
    },
    [itemsMap, getItemName, getAncestorIds, rootIds],
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
