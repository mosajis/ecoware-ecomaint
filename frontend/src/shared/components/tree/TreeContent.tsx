import cn from "classnames";
import { useTree } from "@headless-tree/react";
import { CSSProperties } from "react";

// ===== TreeContent =====
interface TreeContentProps<T> {
  tree: ReturnType<typeof useTree<T>>;
  getItemName: (item: T) => string;
  getItemId: (item: T) => string | number;
  onItemSelect?: (item: T) => void;
  rootIds: (string | number)[];
  onDoubleClick?: (rowId: number) => void;
}

function TreeContent<T>({
  tree,
  getItemName,
  getItemId,
  onItemSelect,
  onDoubleClick,
}: TreeContentProps<T>) {
  const items = tree.getItems();
  return (
    <div {...tree.getContainerProps()} className="tree">
      {items.map((item) => {
        const itemData = item.getItemData();
        const itemId = getItemId(itemData);
        const level = item.getItemMeta().level;

        return (
          <div
            onDoubleClick={() => onDoubleClick?.(Number(itemId))}
            className="tree-item-parent"
            key={itemId}
            {...item.getProps()}
            style={
              {
                paddingLeft: `${level * 20}px`,
                "--tree-level": level,
              } as CSSProperties
            }
            onClick={(e) => {
              item.getProps().onClick?.(e);
              onItemSelect?.(itemData);
            }}
          >
            <div
              className={cn("tree-item", {
                focused: item.isFocused(),
                expanded: item.isExpanded(),
                selected: item.isSelected(),
                folder: item.isFolder(),
              })}
            >
              {getItemName(itemData)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TreeContent;
