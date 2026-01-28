import cn from "classnames";
import { useTree } from "@headless-tree/react";
import { CSSProperties, useRef, useMemo, memo, FC } from "react";

interface TreeContentProps<T> {
  tree: ReturnType<typeof useTree<T>>;
  getItemName: (item: T) => string;
  getItemId: (item: T) => string | number;
  onItemClick?: (item: T) => void;
  onItemDoubleClick?: (rowId: number) => void;
  searchQuery?: string;
}

// ✅ Memoized highlight component
const HighlightedText = memo(function HighlightedText({
  text,
  query,
}: {
  text: string;
  query: string;
}) {
  if (!query) return <>{text}</>;

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);

  if (index === -1) return <>{text}</>;

  return (
    <>
      {text.slice(0, index)}
      <span className="tree-text-highlight">
        {text.slice(index, index + query.length)}
      </span>
      {text.slice(index + query.length)}
    </>
  );
});

// ✅ Cache visibility results to avoid re-computing
const visibilityCache = new WeakMap<any, Map<string, boolean>>();

function isVisible<T>(
  item: any,
  getItemName: (item: T) => string,
  searchQuery?: string,
): boolean {
  const q = searchQuery?.trim().toLowerCase();
  if (!q) return true;

  // ✅ Check cache first
  let itemCache = visibilityCache.get(item);
  if (!itemCache) {
    itemCache = new Map();
    visibilityCache.set(item, itemCache);
  }

  if (itemCache.has(q)) {
    return itemCache.get(q)!;
  }

  // ✅ Check current item
  const itemData = item.getItemData();
  const name = getItemName(itemData).toLowerCase();
  if (name.includes(q)) {
    itemCache.set(q, true);
    return true;
  }

  // ✅ Check children
  const children = item.getChildren();
  const hasVisibleChild = children.some((child: any) =>
    isVisible(child, getItemName, searchQuery),
  );

  itemCache.set(q, hasVisibleChild);
  return hasVisibleChild;
}

// ✅ Memoized TreeItem component to prevent unnecessary re-renders
interface TreeItemProps<T> {
  item: any;
  itemId: string;
  level: number;
  name: string;
  isHighlighted: boolean;
  searchQuery: string;
  onItemClick?: (itemData: T) => void;
  onItemDoubleClick?: (rowId: number) => void;
  clickTimerRef: React.MutableRefObject<number | null>;
  CLICK_DELAY: number;
  // ✅ Add state props so memo can detect changes
  isSelected: boolean;
  isFocused: boolean;
  isExpanded: boolean;
  isFolder: boolean;
}

// Create a wrapper to preserve generics with memo
function TreeItemComponent<T>({
  item,
  itemId,
  level,
  name,
  isHighlighted,
  searchQuery,
  onItemClick,
  onItemDoubleClick,
  clickTimerRef,
  CLICK_DELAY,
  isSelected,
  isFocused,
  isExpanded,
  isFolder,
}: TreeItemProps<T>) {
  const itemData = item.getItemData();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (clickTimerRef.current) return;

    clickTimerRef.current = window.setTimeout(() => {
      clickTimerRef.current = null;
      item.getProps().onClick?.(e);
      onItemClick?.(itemData);
    }, CLICK_DELAY);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
    }

    onItemDoubleClick?.(Number(itemId));
  };

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // ✅ Memoize style object
  const style = useMemo<CSSProperties>(
    () => ({
      paddingLeft: `${level * 20}px`,
      "--tree-level": level,
    }),
    [level],
  );

  // ✅ Build className based on props (memo will detect changes)
  const itemClassName = cn("tree-item", {
    focused: isFocused,
    expanded: isExpanded,
    selected: isSelected,
    folder: isFolder,
    highlight: isHighlighted,
  });

  return (
    <div
      key={itemId}
      className="tree-item-parent"
      style={style}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <div className={itemClassName}>
        {item.isFolder() && (
          <span className="tree-toggle" onClick={handleToggleClick}></span>
        )}

        <span className="tree-label">
          {isHighlighted ? (
            <HighlightedText text={name} query={searchQuery} />
          ) : (
            name
          )}
        </span>
      </div>
    </div>
  );
}

// ✅ Memoize TreeItem while preserving generic type
const TreeItem = memo(TreeItemComponent) as typeof TreeItemComponent;

function TreeContent<T>({
  tree,
  searchQuery,
  getItemName,
  getItemId,
  onItemClick,
  onItemDoubleClick,
}: TreeContentProps<T>) {
  const clickTimerRef = useRef<number | null>(null);
  const CLICK_DELAY = 200;

  const items = tree.getItems();

  // ✅ Memoize visible items calculation
  const visibleItems = useMemo(() => {
    if (!searchQuery) return items;
    return items.filter((item) => isVisible(item, getItemName, searchQuery));
  }, [items, searchQuery, getItemName]);

  // ✅ Process items - don't memoize to get real-time state updates
  const query = searchQuery?.toLowerCase() || "";

  const processedItems = items.map((item) => {
    const itemData = item.getItemData();
    const itemId = String(getItemId(itemData));
    const level = item.getItemMeta().level;
    const name = getItemName(itemData);
    const isItemVisible =
      !searchQuery || isVisible(item, getItemName, searchQuery);
    const isHighlighted = !!query && name.toLowerCase().includes(query);

    // ✅ Get state flags for memo comparison
    const isSelected = item.isSelected();
    const isFocused = item.isFocused();
    const isExpanded = item.isExpanded();
    const isFolder = item.isFolder();

    return {
      item,
      itemId,
      level,
      name,
      isItemVisible,
      isHighlighted,
      isSelected,
      isFocused,
      isExpanded,
      isFolder,
    };
  });

  if (visibleItems.length === 0) {
    return (
      <div
        className="tree not-found"
        style={{ padding: 10, textAlign: "center", color: "#999" }}
      >
        No items found
      </div>
    );
  }

  return (
    <div {...tree.getContainerProps()} className="tree">
      {processedItems.map(
        ({
          item,
          itemId,
          level,
          name,
          isItemVisible,
          isHighlighted,
          isSelected,
          isFocused,
          isExpanded,
          isFolder,
        }) => {
          if (!isItemVisible) return null;

          return (
            <TreeItem<T>
              key={itemId}
              item={item}
              itemId={itemId}
              level={level}
              name={name}
              isHighlighted={isHighlighted}
              searchQuery={searchQuery || ""}
              onItemClick={onItemClick}
              onItemDoubleClick={onItemDoubleClick}
              clickTimerRef={clickTimerRef}
              CLICK_DELAY={CLICK_DELAY}
              isSelected={isSelected}
              isFocused={isFocused}
              isExpanded={isExpanded}
              isFolder={isFolder}
            />
          );
        },
      )}
    </div>
  );
}

export default TreeContent;
