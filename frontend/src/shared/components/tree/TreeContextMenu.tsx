import { useEffect, useState, type MutableRefObject } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

export interface ContextMenuItem<T> {
  label: string;
  onClick: (row: T) => void;
}

export type ContextMenuOpener<T> = (e: React.MouseEvent, row: T) => void;

interface Props<T> {
  items?: ContextMenuItem<T>[];
  openRef: MutableRefObject<ContextMenuOpener<T> | null>;
}

export function TreeContextMenu<T>({ items, openRef }: Props<T>) {
  const [state, setState] = useState<{
    mouseX: number;
    mouseY: number;
    row: T;
  } | null>(null);

  useEffect(() => {
    openRef.current = (e, row) =>
      setState({ mouseX: e.clientX, mouseY: e.clientY, row });
    return () => {
      openRef.current = null;
    };
  }, [openRef]);

  if (!items?.length) return null;

  return (
    <Menu
      open={!!state}
      onClose={() => setState(null)}
      anchorReference="anchorPosition"
      anchorPosition={
        state ? { top: state.mouseY, left: state.mouseX } : undefined
      }
      slotProps={{
        root: {
          onContextMenu: (e: React.MouseEvent) => {
            e.preventDefault();
            setState(null);
          },
        },
      }}
    >
      {items.map((item, index) => (
        <MenuItem
          key={index}
          onClick={() => {
            if (state) item.onClick(state.row);
            setState(null);
          }}
        >
          {item.label}
        </MenuItem>
      ))}
    </Menu>
  );
}
