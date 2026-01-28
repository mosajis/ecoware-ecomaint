import cn from "classnames";
import { useTree } from "@headless-tree/react";
import { CSSProperties, useRef } from "react";

interface TreeContentProps<T> {
  tree: ReturnType<typeof useTree<T>>;
  getItemName: (item: T) => string;
  getItemId: (item: T) => string | number;
  onItemClick?: (item: T) => void;
  onItemDoubleClick?: (rowId: number) => void;
  searchQuery?: string;
}

// helper برای highlight حروف match
function highlightText(text: string, query: string) {
  if (!query) return text;

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);

  if (index === -1) return text;

  return (
    <>
      {text.slice(0, index)}
      <span className="tree-text-highlight">
        {text.slice(index, index + query.length)}
      </span>
      {text.slice(index + query.length)}
    </>
  );
}

function isVisible<T>(
  item: any,
  getItemName: (item: T) => string,
  searchQuery?: string,
): boolean {
  const q = searchQuery?.trim().toLowerCase();
  if (!q) return true;

  if (getItemName(item.getItemData()).toLowerCase().includes(q)) return true;

  return item
    .getChildren()
    .some((child: any) => isVisible(child, getItemName, searchQuery));
}

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

  const visibleItems = items.filter((item) =>
    isVisible(item, getItemName, searchQuery),
  );

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
      {items.map((item) => {
        const itemData = item.getItemData();
        const itemId = String(getItemId(itemData));
        const level = item.getItemMeta().level;
        const name = getItemName(itemData);

        if (!isVisible(item, getItemName, searchQuery)) return null;

        const isHighlighted =
          !!searchQuery &&
          name.toLowerCase().includes(searchQuery.toLowerCase());

        const handleClick = (e: React.MouseEvent) => {
          e.stopPropagation();

          if (clickTimerRef.current) return;

          clickTimerRef.current = window.setTimeout(() => {
            clickTimerRef.current = null;

            // رفتار پیش‌فرض tree
            item.getProps().onClick?.(e);

            // انتخاب آیتم
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

        return (
          <div
            key={itemId}
            className="tree-item-parent"
            style={
              {
                paddingLeft: `${level * 20}px`,
                "--tree-level": level,
              } as CSSProperties
            }
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
          >
            <div
              className={cn("tree-item", {
                focused: item.isFocused(),
                expanded: item.isExpanded(),
                selected: item.isSelected(),
                folder: item.isFolder(),
                highlight: isHighlighted,
              })}
            >
              {item.isFolder() && (
                <span
                  className="tree-toggle"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                ></span>
              )}

              <span className="tree-label">
                {isHighlighted ? highlightText(name, searchQuery!) : name}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TreeContent;
