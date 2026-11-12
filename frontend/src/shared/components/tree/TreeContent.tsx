import cn from "classnames";
import { useTree } from "@headless-tree/react";
import type { ItemInstance } from "@headless-tree/core";
import { CSSProperties, memo } from "react";

interface TreeContentProps<T> {
  tree: ReturnType<typeof useTree<T>>;
  getItemName: (item: T) => string;
  onItemClick?: (item: T) => void;
  onItemDoubleClick?: (rowId: number) => void;
  onItemContextMenu?: (event: React.MouseEvent, item: T) => void;
  /** متن جستجوی اعمال‌شده (lowercase، برای هایلایت) */
  searchQuery?: string;
  /** null یعنی جستجوی فعال نیست */
  visibleIds?: Set<string> | null;
  matchedIds?: Set<string> | null;
}

const HighlightedText = memo(function HighlightedText({
  text,
  query,
}: {
  text: string;
  query: string;
}) {
  const index = text.toLowerCase().indexOf(query);
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

interface TreeItemProps<T> {
  item: ItemInstance<T>;
  itemId: string;
  level: number;
  name: string;
  query: string;
  isHighlighted: boolean;
  isSelected: boolean;
  isFocused: boolean;
  isExpanded: boolean;
  isFolder: boolean;
  onItemClick?: (item: T) => void;
  onItemDoubleClick?: (rowId: number) => void;
  onItemContextMenu?: (event: React.MouseEvent, item: T) => void;
}

function TreeItemComponent<T>({
  item,
  itemId,
  level,
  name,
  query,
  isHighlighted,
  isSelected,
  isFocused,
  isExpanded,
  isFolder,
  onItemClick,
  onItemDoubleClick,
  onItemContextMenu,
}: TreeItemProps<T>) {
  // تأخیر تشخیص single/double click در GenericTree انجام می‌شود
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    item.getProps().onClick?.(e);
    onItemClick?.(item.getItemData());
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onItemDoubleClick?.(Number(itemId));
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const data = item.getItemData();
    item.getTree().setSelectedItems([itemId]);
    onItemClick?.(data);
    onItemContextMenu?.(e, data);
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (item.isExpanded()) {
      item.collapse();
    } else {
      item.expand();
    }
  };

  const style: CSSProperties = {
    paddingLeft: `${level * 20}px`,
    ["--tree-level" as string]: level,
  };

  return (
    <div
      className="tree-item-parent"
      style={style}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
    >
      <div
        className={cn("tree-item", {
          focused: isFocused,
          expanded: isExpanded,
          selected: isSelected,
          folder: isFolder,
          highlight: isHighlighted,
        })}
      >
        {isFolder && <span className="tree-toggle" onClick={handleToggle} />}

        <span className="tree-label">
          {isHighlighted ? <HighlightedText text={name} query={query} /> : name}
        </span>
      </div>
    </div>
  );
}

const TreeItem = memo(TreeItemComponent) as typeof TreeItemComponent;

function TreeContent<T>({
  tree,
  searchQuery = "",
  visibleIds = null,
  matchedIds = null,
  getItemName,
  onItemClick,
  onItemDoubleClick,
  onItemContextMenu,
}: TreeContentProps<T>) {
  const items = Array.from(tree.getItems());

  const rows: React.ReactNode[] = [];

  for (const item of items) {
    const itemId = item.getId();

    if (visibleIds && !visibleIds.has(itemId)) continue;

    rows.push(
      <TreeItem<T>
        key={itemId}
        item={item}
        itemId={itemId}
        level={item.getItemMeta().level}
        name={getItemName(item.getItemData())}
        query={searchQuery}
        isHighlighted={!!matchedIds?.has(itemId)}
        isSelected={item.isSelected()}
        isFocused={item.isFocused()}
        isExpanded={item.isExpanded()}
        isFolder={item.isFolder()}
        onItemClick={onItemClick}
        onItemDoubleClick={onItemDoubleClick}
        onItemContextMenu={onItemContextMenu}
      />,
    );
  }

  console.log("TREE FINAL DEBUG", {
    itemsCount: items.length,
    rowsCount: rows.length,
    itemIds: items.map((item) => item.getId()),
    expandedItems: tree.getState().expandedItems,
  });

  if (rows.length === 0) {
    return <div className="tree not-found">No items found</div>;
  }

  return (
    <div {...tree.getContainerProps()} className="tree">
      {rows}
    </div>
  );
}

export default TreeContent;
