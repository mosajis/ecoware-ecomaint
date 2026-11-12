import TreeHeader from "./TreeHeader";
import TreeContent from "./TreeContent";
import {
  TreeContextMenu,
  type ContextMenuItem,
  type ContextMenuOpener,
} from "./TreeContextMenu";
import { getPermit } from "@/shared/hooks/usePermison";
import { useTree } from "@headless-tree/react";
import { useEffect, useCallback, useState, useMemo, useRef } from "react";
import { TreeDataMapper } from "@/shared/hooks/useDataTree";
import {
  syncDataLoaderFeature,
  selectionFeature,
  hotkeysCoreFeature,
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
  elementId?: number;
  contextMenuItems?: ContextMenuItem<T>[];
}

const DEFAULT_PERMISSIONS = {
  canCreate: true,
  canUpdate: true,
  canDelete: true,
  canView: true,
  canExport: true,
};

const CLICK_DELAY = 200;

// فقط شاخه‌ی اول پیش‌فرض باز باشد
const getInitialExpanded = (rootIds: number[]) =>
  rootIds.slice(0, 1).map(String);

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
  contextMenuItems,
}: GenericTreeProps<T>) {
  const permissions = elementId ? getPermit(elementId) : DEFAULT_PERMISSIONS;
  const { canCreate, canUpdate, canDelete, canView } = permissions;

  const { itemsMap, childrenMap, rootIds } = data;

  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [focusedItem, setFocusedItem] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initializedRef = useRef(false);
  const preSearchExpandedRef = useRef<string[] | null>(null);
  const contextMenuOpenerRef = useRef<ContextMenuOpener<T> | null>(null);

  // callbackها در ref تا با تغییر هویتشان، config درخت دوباره ساخته نشود
  const getItemNameRef = useRef(getItemName);
  const getItemIdRef = useRef(getItemId);
  getItemNameRef.current = getItemName;
  getItemIdRef.current = getItemId;

  // Parent lookup
  const parentMap = useMemo(() => {
    const map = new Map<number, number>();
    for (const [parentId, children] of childrenMap) {
      for (const childId of children) map.set(childId, parentId);
    }
    return map;
  }, [childrenMap]);

  // Search index
  const searchIndex = useMemo(() => {
    const index = new Map<string, string>();
    for (const [id, item] of itemsMap) {
      index.set(String(id), getItemNameRef.current(item).toLowerCase());
    }
    return index;
  }, [itemsMap]);
  // همگام‌سازی state با داده + باز کردن شاخه‌ی اول (فقط یک بار)
  useEffect(() => {
    if (itemsMap.size === 0 || rootIds.length === 0) return;

    const validIds = new Set(Array.from(itemsMap.keys(), String));

    setExpandedItems((prev) => {
      const next = prev.filter((id) => validIds.has(id));

      if (initializedRef.current) return next;

      initializedRef.current = true;

      return Array.from(new Set([...next, ...getInitialExpanded(rootIds)]));
    });

    setSelectedItems((prev) => prev.filter((id) => validIds.has(id)));

    setFocusedItem((prev) => (prev && validIds.has(prev) ? prev : null));
  }, [itemsMap, rootIds]);
  // Cleanup timer
  useEffect(() => {
    return () => {
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
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

  // نتیجه‌ی جستجو: فقط وقتی searchQuery (بعد از OK) عوض شود محاسبه می‌شود
  const searchResult = useMemo(() => {
    if (!searchQuery) return null;

    const matched = new Set<string>();
    const visible = new Set<string>();

    for (const [id, name] of searchIndex) {
      if (!name.includes(searchQuery)) continue;
      matched.add(id);
      visible.add(id);
      for (const ancestor of getAncestorIds(Number(id))) visible.add(ancestor);
    }

    return { matched, visible };
  }, [searchQuery, searchIndex, getAncestorIds]);

  // Tree configuration
  const treeConfig = useMemo(
    () => ({
      rootItemId: "root" as const,
      state: { selectedItems, expandedItems, focusedItem },
      setSelectedItems,
      setExpandedItems,
      setFocusedItem,

      getItemName: (item: any) => {
        const itemData = item.getItemData();
        return itemData ? getItemNameRef.current(itemData) : "";
      },

      isItemFolder: (item: any) => {
        const itemData = item.getItemData();
        if (!itemData) return false;

        const id = Number(getItemIdRef.current(itemData));
        if (Number.isNaN(id)) return false;

        return (childrenMap.get(id)?.length ?? 0) > 0;
      },

      dataLoader: {
        getItem: (itemId: string) => {
          if (itemId === "root") return {} as T;
          return itemsMap.get(Number(itemId)) ?? ({ id: itemId } as T);
        },
        getChildren: (itemId: string) => {
          if (itemId === "root") return rootIds.map(String);

          const children = childrenMap.get(Number(itemId));
          if (!children) return [];

          return children.filter((id) => itemsMap.has(id)).map(String);
        },
      },

      features: [syncDataLoaderFeature, selectionFeature, hotkeysCoreFeature],
    }),
    [selectedItems, expandedItems, focusedItem, childrenMap, itemsMap, rootIds],
  );

  const tree = useTree<T>(treeConfig);

  useEffect(() => {
    console.log("TREE AFTER DATA:", {
      itemCount: itemsMap.size,
      rootIds,
      expandedItems,
      rootChildren: tree.getItemInstance("root").getChildren().length,
      visibleItems: tree.getItems().map((item) => item.getId()),
    });
  }, [itemsMap, expandedItems, tree]);

  const handleExpandAll = useCallback(() => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      for (const [id, children] of childrenMap) {
        if (children.length > 0) next.add(String(id));
      }
      return Array.from(next);
    });
  }, [childrenMap]);

  const handleCollapseAll = useCallback(() => setExpandedItems([]), []);

  const handleEdit = useCallback(() => {
    const first = selectedItems[0];
    if (first && onEdit) onEdit(Number(first));
  }, [selectedItems, onEdit]);

  const handleDelete = useCallback(() => {
    const first = selectedItems[0];
    if (first && onDelete) onDelete(Number(first));
  }, [selectedItems, onDelete]);

  // انتخاب آیتم در TreeContent فوری است؛ فقط onItemSelect با تأخیر صدا زده می‌شود
  const handleItemClick = useCallback(
    (item: T) => {
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);

      clickTimerRef.current = setTimeout(() => {
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

  // Cancel: پاک کردن جستجو و برگرداندن وضعیت قبلی درخت
  const handleSearchCancel = useCallback(() => {
    setSearchQuery("");

    const saved = preSearchExpandedRef.current;
    if (saved) {
      preSearchExpandedRef.current = null;
      setExpandedItems(saved);
    }
  }, []);

  // OK: اعمال جستجو
  const handleSearchApply = useCallback(
    (txt: string) => {
      const q = txt.trim().toLowerCase();

      if (!q) {
        handleSearchCancel();
        return;
      }

      // وضعیت قبل از اولین جستجو را ذخیره کن
      if (!preSearchExpandedRef.current) {
        preSearchExpandedRef.current = expandedItems;
      }

      // فقط ancestorهای نتایج باز می‌شوند
      const nextExpanded = new Set<string>();

      for (const [id, name] of searchIndex) {
        if (!name.includes(q)) continue;
        for (const ancestor of getAncestorIds(Number(id))) {
          nextExpanded.add(ancestor);
        }
      }

      setSearchQuery(q);
      setExpandedItems(Array.from(nextExpanded));
    },
    [searchIndex, getAncestorIds, expandedItems, handleSearchCancel],
  );

  // Context menu (state در کامپوننت جدا، بدون رندر درخت)
  const handleContextMenu = useCallback((e: React.MouseEvent, row: T) => {
    e.preventDefault();
    contextMenuOpenerRef.current?.(e, row);
  }, []);

  if (!canView) return null;

  return (
    <div className="tree-container" onContextMenu={(e) => e.preventDefault()}>
      <TreeHeader
        label={label || "Tree View"}
        onSearchApply={handleSearchApply}
        onSearchCancel={handleSearchCancel}
        onDelete={canDelete && onDelete ? handleDelete : undefined}
        onEdit={canUpdate && onEdit ? handleEdit : undefined}
        onAdd={canCreate && onAdd ? onAdd : undefined}
        onRefresh={onRefresh}
        onExpandAll={handleExpandAll}
        onCollapseAll={handleCollapseAll}
        loading={loading}
        hasSelection={selectedItems.length > 0}
      />

      <TreeContent
        tree={tree}
        searchQuery={searchQuery}
        visibleIds={searchResult?.visible ?? null}
        matchedIds={searchResult?.matched ?? null}
        onItemClick={handleItemClick}
        onItemDoubleClick={handleItemDoubleClick}
        onItemContextMenu={handleContextMenu}
        getItemName={getItemName}
      />

      <TreeContextMenu
        items={contextMenuItems}
        openRef={contextMenuOpenerRef}
      />
    </div>
  );
}
