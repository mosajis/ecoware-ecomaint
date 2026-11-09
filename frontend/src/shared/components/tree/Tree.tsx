import TreeHeader from "./TreeHeader";
import TreeContent from "./TreeContent";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
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

interface ContextMenuItem<T> {
  label: string;
  onClick: (row: T) => void;
}

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
  onRefresh: _onRefresh,
  loading = false,
  elementId,
  contextMenuItems,
}: GenericTreeProps<T>) {
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    row: T;
  } | null>(null);

  const permissions = elementId ? getPermit(elementId) : DEFAULT_PERMISSIONS;

  const { canCreate, canUpdate, canDelete, canView } = permissions;

  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [focusedItem, setFocusedItem] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousItemsRef = useRef(data.itemsMap);
  const previousRootsRef = useRef(data.rootIds);

  const { itemsMap, childrenMap, rootIds } = data;

  // Parent lookup فقط هنگام تغییر childrenMap
  const parentMap = useMemo(() => {
    const map = new Map<number, number>();

    for (const [parentId, children] of childrenMap) {
      for (const childId of children) {
        map.set(childId, parentId);
      }
    }

    return map;
  }, [childrenMap]);

  // پاکسازی state هنگام تغییر داده
  useEffect(() => {
    const validIds = new Set(Array.from(itemsMap.keys(), String));

    const isInitial = previousItemsRef.current === null;

    setExpandedItems((prev) => {
      const cleaned = prev.filter((id) => validIds.has(id));
      const expanded = new Set(cleaned);

      for (const id of rootIds) {
        expanded.add(String(id));
      }

      return Array.from(expanded);
    });

    setSelectedItems((prev) => prev.filter((id) => validIds.has(id)));

    setFocusedItem((prev) => (prev && validIds.has(prev) ? prev : null));

    previousItemsRef.current = itemsMap;
    previousRootsRef.current = rootIds;
  }, [itemsMap, rootIds]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
      }
    };
  }, []);

  // Ancestor lookup
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

  // Search index
  const searchIndex = useMemo(() => {
    const index = new Map<string, string>();

    for (const [id, item] of itemsMap) {
      index.set(String(id), getItemName(item).toLowerCase());
    }

    return index;
  }, [itemsMap, getItemName]);
  // Tree configuration
  const treeConfig = useMemo(
    () => ({
      rootItemId: "root" as const,

      state: {
        selectedItems,
        expandedItems,
        focusedItem,
      },

      setSelectedItems,
      setExpandedItems,
      setFocusedItem,

      getItemName: (item: any) => {
        const itemData = item.getItemData();
        return itemData ? getItemName(itemData) : "";
      },

      isItemFolder: (item: any) => {
        const itemData = item.getItemData();

        if (!itemData) return false;

        const id = Number(getItemId(itemData));

        if (Number.isNaN(id)) return false;

        return (childrenMap.get(id)?.length ?? 0) > 0;
      },

      dataLoader: {
        getItem: (itemId: string) => {
          if (itemId === "root") return {} as T;

          return itemsMap.get(Number(itemId)) ?? ({ id: itemId } as T);
        },

        getChildren: (itemId: string) => {
          if (itemId === "root") {
            return rootIds.map(String);
          }

          const children = childrenMap.get(Number(itemId));

          if (!children) return [];

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

  // Expand all
  const handleExpandAll = useCallback(() => {
    setExpandedItems((prev) => {
      const next = new Set(prev);

      for (const [id, children] of childrenMap) {
        if (children.length > 0) {
          next.add(String(id));
        }
      }

      return Array.from(next);
    });
  }, [childrenMap]);

  // Collapse all
  const handleCollapseAll = useCallback(() => {
    setExpandedItems([]);
  }, []);

  // Edit
  const handleEdit = useCallback(() => {
    const firstSelected = selectedItems[0];

    if (firstSelected && onEdit) {
      onEdit(Number(firstSelected));
    }
  }, [selectedItems, onEdit]);

  // Delete
  const handleDelete = useCallback(() => {
    const firstSelected = selectedItems[0];

    if (firstSelected && onDelete) {
      onDelete(Number(firstSelected));
    }
  }, [selectedItems, onDelete]);

  // Single click
  const handleItemClick = useCallback(
    (item: T) => {
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
      }

      clickTimerRef.current = setTimeout(() => {
        clickTimerRef.current = null;
        onItemSelect?.(item);
      }, CLICK_DELAY);
    },
    [onItemSelect],
  );

  // Double click
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

  // Search
  const handleSearch = useCallback(
    (txt: string) => {
      const q = txt.trim().toLowerCase();

      setSearchQuery(q);

      if (!q) {
        setExpandedItems((prev) => {
          const validIds = new Set(Array.from(itemsMap.keys(), String));

          return prev.filter((id) => validIds.has(id));
        });

        return;
      }

      const nextExpanded = new Set<string>();

      for (const [id, name] of searchIndex) {
        if (!name.includes(q)) continue;

        nextExpanded.add(id);

        const numericId = Number(id);

        getAncestorIds(numericId).forEach((ancestor) => {
          nextExpanded.add(ancestor);
        });
      }

      setExpandedItems(
        nextExpanded.size > 0 ? Array.from(nextExpanded) : rootIds.map(String),
      );
    },
    [searchIndex, itemsMap, getAncestorIds, rootIds],
  );

  // Context menu
  const handleContextMenu = useCallback((event: React.MouseEvent, row: T) => {
    event.preventDefault();

    setContextMenu({
      mouseX: event.clientX,
      mouseY: event.clientY,
      row,
    });
  }, []);

  // Hooks must always execute before conditional return
  if (!canView) return null;

  return (
    <div className="tree-container" onContextMenu={(e) => e.preventDefault()}>
      <TreeHeader
        label={label || "Tree View"}
        onSearch={handleSearch}
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
        onItemClick={handleItemClick}
        onItemDoubleClick={handleItemDoubleClick}
        onItemContextMenu={handleContextMenu}
        getItemName={getItemName}
        getItemId={getItemId}
      />

      <Menu
        slotProps={{
          root: {
            onContextMenu: (e: any) => {
              e.preventDefault();
              setContextMenu(null);
            },
          },
        }}
        open={!!contextMenu}
        onClose={() => setContextMenu(null)}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu
            ? {
                top: contextMenu.mouseY,
                left: contextMenu.mouseX,
              }
            : undefined
        }
      >
        {contextMenuItems?.map((menuItem, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              if (contextMenu) {
                menuItem.onClick(contextMenu.row);
              }

              setContextMenu(null);
            }}
          >
            {menuItem.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
