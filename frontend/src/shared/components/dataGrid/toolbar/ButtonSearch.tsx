import { useEffect, useRef, useState } from "react";
import { styled } from "@mui/material/styles";
import {
  ToolbarButton,
  QuickFilter,
  QuickFilterControl,
  QuickFilterClear,
  QuickFilterTrigger,
} from "@mui/x-data-grid";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from "@mui/icons-material/Search";

type OwnerState = {
  expanded: boolean;
};

function assignRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (!ref) return;

  if (typeof ref === "function") {
    ref(value);
  } else {
    (ref as React.MutableRefObject<T | null>).current = value;
  }
}

const StyledQuickFilter = styled(QuickFilter)({
  display: "grid",
});

const StyledToolbarButton = styled(ToolbarButton)<{ ownerState: OwnerState }>(
  ({ theme, ownerState }) => ({
    gridArea: "1 / 1",
    zIndex: 1,
    opacity: ownerState.expanded ? 0 : 1,
    pointerEvents: ownerState.expanded ? "none" : "auto",
    transition: theme.transitions.create(["opacity"]),
  }),
);

const StyledTextField = styled(TextField)<{ ownerState: OwnerState }>(
  ({ theme, ownerState }) => ({
    gridArea: "1 / 1",
    overflowX: "clip",
    width: ownerState.expanded ? 260 : "var(--trigger-width)",
    opacity: ownerState.expanded ? 1 : 0,
    transition: theme.transitions.create(["width", "opacity"]),
  }),
);

export default function ButtonSearch() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [expanded, setExpanded] = useState(false);

  const focusInput = () => {
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const handleOpen = () => {
    setExpanded(true);
    focusInput();
  };

  const handleClose = () => {
    setExpanded(false);
    // inputRef.current?.blur();
  };

  const handleBlur = (value: string) => {
    if (!value) handleClose();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toLowerCase().includes("mac");
      const isSearchShortcut = isMac
        ? e.metaKey && e.key.toLowerCase() === "f"
        : e.ctrlKey && e.key.toLowerCase() === "f";

      if (!isSearchShortcut) return;

      e.preventDefault();
      handleOpen();
    };

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <StyledQuickFilter>
      <QuickFilterTrigger
        size="small"
        render={(triggerProps, state) => (
          <Tooltip title="Search" enterDelay={0}>
            <StyledToolbarButton
              {...triggerProps}
              ownerState={{ expanded: expanded || state.expanded }}
              color="default"
              onClick={(e) => {
                triggerProps.onClick?.(e);
                handleOpen();
              }}
            >
              <SearchIcon fontSize="small" />
            </StyledToolbarButton>
          </Tooltip>
        )}
      />

      <QuickFilterControl
        render={({ ref, ...controlProps }, state) => (
          <StyledTextField
            {...controlProps}
            ownerState={{ expanded: expanded || state.expanded }}
            aria-label="Search"
            placeholder="Search..."
            size="small"
            inputRef={(node) => {
              assignRef(ref, node);
              inputRef.current = node;
            }}
            onBlur={(e) => handleBlur(e.target.value)}
            slotProps={{
              input: {
                ...controlProps.slotProps?.input,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: state.value ? (
                  <InputAdornment position="end">
                    <QuickFilterClear
                      edge="end"
                      size="small"
                      render={
                        <CancelIcon
                          fontSize="small"
                          sx={{ cursor: "pointer" }}
                        />
                      }
                    />
                  </InputAdornment>
                ) : null,
              },
            }}
          />
        )}
      />
    </StyledQuickFilter>
  );
}
