import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTheme } from "@mui/material/styles";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import FormatTextdirectionRToLIcon from "@mui/icons-material/FormatTextdirectionRToL";
import FormatTextdirectionLToRIcon from "@mui/icons-material/FormatTextdirectionLToR";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import Editor, {
  Toolbar,
  BtnBold,
  BtnItalic,
  createButton,
  ContentEditableEvent,
} from "react-simple-wysiwyg";

const BtnUndo = createButton("Undo", "↶", "undo");
const BtnRedo = createButton("Redo", "↷", "redo");

type Direction = "rtl" | "ltr";
type Alignment = "left" | "center" | "right" | "justify";
type AutoSaveStatus = "idle" | "saving" | "saved";

interface AppEditorProps {
  error?: boolean;
  helperText?: string;
  initValue?: string | null;
  onSave?: (currentValue: string) => Promise<void> | void;
  onChange?: (currentValue: string) => void;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  containerStyle?: React.CSSProperties;
  className?: string;
  autoSave?: boolean;
  autoSaveDelay?: number;
  label?: string;
  loading?: boolean;
}

const DEFAULT_DIRECTION: Direction = "rtl";
const DEFAULT_ALIGNMENT: Alignment = "right";
const BLOCK_SELECTOR = "p,div,h1,h2,h3,h4,h5,h6,blockquote,pre,li";

const getEditorElement = (root: HTMLDivElement | null) =>
  root?.querySelector<HTMLElement>('[contenteditable="true"]') ?? null;

/** setAttribute/style don't fire `input`, so tell react-simple-wysiwyg manually. */
const notifyChange = (editor: HTMLElement) =>
  editor.dispatchEvent(new Event("input", { bubbles: true }));

/** Blocks affected by the selection (only the caret's block when collapsed). */
function getSelectedBlocks(editor: HTMLElement): HTMLElement[] {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return [];

  const range = selection.getRangeAt(0);
  if (!editor.contains(range.commonAncestorContainer)) return [];

  const anchor =
    range.startContainer.nodeType === Node.ELEMENT_NODE
      ? (range.startContainer as Element)
      : range.startContainer.parentElement;

  if (range.collapsed) {
    const block = anchor?.closest<HTMLElement>(BLOCK_SELECTOR);
    return block && block !== editor && editor.contains(block)
      ? [block]
      : [editor];
  }

  const blocks = Array.from(
    editor.querySelectorAll<HTMLElement>(BLOCK_SELECTOR),
  ).filter((block) => {
    try {
      return range.intersectsNode(block);
    } catch {
      return false;
    }
  });

  return blocks.length ? blocks : [editor];
}

/** Visual (physical) alignment of a block, resolving start/end by direction. */
function getBlockState(block: HTMLElement): {
  direction: Direction;
  alignment: Alignment;
} {
  const computed = window.getComputedStyle(block);
  const direction: Direction = computed.direction === "ltr" ? "ltr" : "rtl";

  switch (computed.textAlign) {
    case "left":
    case "center":
    case "right":
    case "justify":
      return { direction, alignment: computed.textAlign };
    case "end":
      return { direction, alignment: direction === "rtl" ? "left" : "right" };
    default: // "start" / "match-parent"
      return { direction, alignment: direction === "rtl" ? "right" : "left" };
  }
}

/**
 * Word behavior: direction is a paragraph property (never tied to the keyboard
 * language), and switching it mirrors left/right alignment.
 */
function applyDirectionToSelection(editor: HTMLElement, next: Direction) {
  getSelectedBlocks(editor).forEach((block) => {
    const { direction: prev, alignment } = getBlockState(block);

    block.setAttribute("dir", next);
    block.style.direction = next;

    if (prev !== next && (alignment === "left" || alignment === "right")) {
      block.style.textAlign = alignment === "left" ? "right" : "left";
    }
  });
  notifyChange(editor);
}

function applyAlignmentToSelection(editor: HTMLElement, next: Alignment) {
  getSelectedBlocks(editor).forEach((block) => {
    block.style.textAlign = next;
  });
  notifyChange(editor);
}

function ToolbarButton({
  title,
  children,
  active = false,
  disabled = false,
  onClick,
}: {
  title: string;
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <IconButton
      size="small"
      title={title}
      aria-label={title}
      aria-pressed={active}
      disabled={disabled}
      // Keep the editor selection/caret when the toolbar receives focus.
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      sx={{
        width: 34,
        height: 32,
        borderRadius: 1,
        border: "1px solid",
        borderColor: active ? "primary.main" : "transparent",
        color: active ? "primary.main" : "text.primary",
        backgroundColor: active ? "action.selected" : "transparent",
        "&:hover": {
          backgroundColor: active ? "action.selected" : "action.hover",
        },
        "&.Mui-disabled": { color: "text.disabled" },
      }}
    >
      {children}
    </IconButton>
  );
}

const Divider = memo(() => {
  const theme = useTheme();
  return (
    <div
      aria-hidden="true"
      style={{
        width: 1,
        height: 24,
        backgroundColor: (theme.vars || theme).palette.divider,
        margin: "0 4px",
      }}
    />
  );
});

const EditorToolbar = memo(
  ({
    label,
    disabled,
    loading,
    readOnly,
    autoSaveEnabled,
    autoSaveStatus,
    changed,
    onSave,
    editorRootRef,
  }: {
    label?: string;
    disabled: boolean;
    loading: boolean;
    readOnly: boolean;
    autoSaveEnabled: boolean;
    autoSaveStatus: AutoSaveStatus;
    changed: boolean;
    onSave: () => void;
    editorRootRef: React.RefObject<HTMLDivElement | null>;
  }) => {
    const theme = useTheme();
    const palette = (theme.vars || theme).palette;
    const [direction, setDirection] = useState<Direction>(DEFAULT_DIRECTION);
    const [alignment, setAlignment] = useState<Alignment>(DEFAULT_ALIGNMENT);
    const toolbarDisabled = disabled || loading || readOnly;
    const iconColor = { color: palette.text.primary };

    const refreshSelectionState = useCallback(() => {
      const editor = getEditorElement(editorRootRef.current);
      if (!editor) return;

      // Ignore selection changes outside this editor.
      const selection = window.getSelection();
      if (!selection?.anchorNode || !editor.contains(selection.anchorNode)) {
        return;
      }

      const block = getSelectedBlocks(editor)[0] ?? editor;
      const state = getBlockState(block);
      setDirection(state.direction);
      setAlignment(state.alignment);
    }, [editorRootRef]);

    useEffect(() => {
      const root = editorRootRef.current;
      document.addEventListener("selectionchange", refreshSelectionState);
      // Direction/alignment changes don't move the selection, so also refresh on input.
      root?.addEventListener("input", refreshSelectionState);
      return () => {
        document.removeEventListener("selectionchange", refreshSelectionState);
        root?.removeEventListener("input", refreshSelectionState);
      };
    }, [refreshSelectionState, editorRootRef]);

    const handleDirection = (next: Direction) => {
      const editor = getEditorElement(editorRootRef.current);
      if (!editor || toolbarDisabled) return;
      editor.focus();
      applyDirectionToSelection(editor, next);
    };

    const handleAlignment = (next: Alignment) => {
      const editor = getEditorElement(editorRootRef.current);
      if (!editor || toolbarDisabled) return;
      editor.focus();
      applyAlignmentToSelection(editor, next);
    };

    const saveButtonStyle: React.CSSProperties = {
      padding: "6px 12px",
      cursor: toolbarDisabled || !changed ? "not-allowed" : "pointer",
      fontSize: 14,
      fontWeight: 700,
      borderRadius: 4,
      display: "flex",
      alignItems: "center",
      gap: 6,
      border: `1px solid ${palette.divider}`,
      opacity: toolbarDisabled || !changed ? 0.6 : 1,
      color: palette.primary.main,
      background: "transparent",
    };

    return (
      <Toolbar
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row-reverse",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 6,
          backgroundColor: palette.background.paper,
          borderBottom: `1px solid ${palette.divider}`,
          padding: "4px 8px",
          minHeight: 45,
        }}
      >
        {label ? (
          <Typography fontWeight="bold" sx={{ mr: 1 }}>
            {label}
          </Typography>
        ) : (
          <span />
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 3,
          }}
        >
          <BtnBold style={iconColor} />
          <BtnItalic style={iconColor} />

          <Divider />

          <ToolbarButton
            title="Right to Left (Ctrl + Right Shift)"
            active={direction === "rtl"}
            disabled={toolbarDisabled}
            onClick={() => handleDirection("rtl")}
          >
            <FormatTextdirectionRToLIcon fontSize="small" />
          </ToolbarButton>
          <ToolbarButton
            title="Left to Right (Ctrl + Left Shift)"
            active={direction === "ltr"}
            disabled={toolbarDisabled}
            onClick={() => handleDirection("ltr")}
          >
            <FormatTextdirectionLToRIcon fontSize="small" />
          </ToolbarButton>

          <Divider />

          <ToolbarButton
            title="Align Left"
            active={alignment === "left"}
            disabled={toolbarDisabled}
            onClick={() => handleAlignment("left")}
          >
            <FormatAlignLeftIcon fontSize="small" />
          </ToolbarButton>
          <ToolbarButton
            title="Align Center"
            active={alignment === "center"}
            disabled={toolbarDisabled}
            onClick={() => handleAlignment("center")}
          >
            <FormatAlignCenterIcon fontSize="small" />
          </ToolbarButton>
          <ToolbarButton
            title="Align Right"
            active={alignment === "right"}
            disabled={toolbarDisabled}
            onClick={() => handleAlignment("right")}
          >
            <FormatAlignRightIcon fontSize="small" />
          </ToolbarButton>
          <ToolbarButton
            title="Justify"
            active={alignment === "justify"}
            disabled={toolbarDisabled}
            onClick={() => handleAlignment("justify")}
          >
            <FormatAlignJustifyIcon fontSize="small" />
          </ToolbarButton>

          <Divider />

          <BtnUndo style={iconColor} />
          <BtnRedo style={iconColor} />

          {!readOnly && (
            <>
              <Divider />
              {autoSaveEnabled ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    fontSize: 12,
                    opacity: 0.75,
                    padding: "0 6px",
                  }}
                >
                  {autoSaveStatus === "saving" && (
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        border: "2px solid currentColor",
                        borderTopColor: "transparent",
                        animation: "app-editor-spin .7s linear infinite",
                      }}
                    />
                  )}
                  {autoSaveStatus === "saved" && <span>✓</span>}
                  {autoSaveStatus === "idle" && <span>●</span>}
                  <span>
                    {autoSaveStatus === "saving"
                      ? "Saving..."
                      : autoSaveStatus === "saved"
                        ? "Saved"
                        : "Auto-save"}
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onSave}
                  disabled={toolbarDisabled || !changed}
                  style={saveButtonStyle}
                  title={
                    loading ? "Saving..." : changed ? "Save" : "No changes"
                  }
                >
                  {loading ? "Saving..." : "✓ Save"}
                </button>
              )}
            </>
          )}
        </div>

        <style>
          {`@keyframes app-editor-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}
        </style>
      </Toolbar>
    );
  },
);

function AppEditor({
  error = false,
  helperText,
  initValue = "",
  onSave,
  onChange,
  placeholder = "...",
  disabled = false,
  readOnly = false,
  containerStyle,
  className,
  autoSave = true,
  autoSaveDelay = 2000,
  label,
  loading = false,
}: AppEditorProps) {
  const theme = useTheme();
  const palette = (theme.vars || theme).palette;
  const editorRootRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [value, setValue] = useState(initValue || "");
  const [initial, setInitial] = useState(initValue || "");
  const [changed, setChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<AutoSaveStatus>("idle");

  useEffect(() => {
    const nextValue = initValue || "";
    setValue(nextValue);
    setInitial(nextValue);
    setChanged(false);
  }, [initValue]);

  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    },
    [],
  );

  const handleAutoSave = useCallback(
    async (content: string) => {
      if (!onSave) return;

      try {
        setAutoSaveStatus("saving");
        await onSave(content);
        setInitial(content);
        setChanged(false);
        setAutoSaveStatus("saved");
      } catch (err) {
        console.error("Auto-save failed:", err);
        setAutoSaveStatus("idle");
      }
    },
    [onSave],
  );

  const handleChange = useCallback(
    (event: ContentEditableEvent) => {
      if (readOnly || disabled) return;

      const newValue = event.target.value;
      setValue(newValue);
      const hasChanged = newValue !== initial;
      setChanged(hasChanged);
      onChange?.(newValue);

      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (autoSave && hasChanged && onSave) {
        setAutoSaveStatus("idle");
        debounceRef.current = setTimeout(() => {
          void handleAutoSave(newValue);
        }, autoSaveDelay);
      }
    },
    [
      readOnly,
      disabled,
      initial,
      onChange,
      autoSave,
      onSave,
      autoSaveDelay,
      handleAutoSave,
    ],
  );

  const handleSave = useCallback(async () => {
    if (!onSave || !changed || disabled || readOnly) return;

    try {
      setIsSaving(true);
      await onSave(value);
      setInitial(value);
      setChanged(false);
    } finally {
      setIsSaving(false);
    }
  }, [changed, value, onSave, disabled, readOnly]);

  /**
   * Word shortcuts: Ctrl + Left Shift => LTR, Ctrl + Right Shift => RTL.
   * We handle them ourselves so the browser's native behavior doesn't
   * run and the direction is always applied to the paragraph only.
   */
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (!event.ctrlKey || event.altKey || event.metaKey) return;
      if (event.code !== "ShiftLeft" && event.code !== "ShiftRight") return;

      event.preventDefault();
      if (event.repeat || readOnly || disabled || loading || isSaving) return;

      const editor = getEditorElement(editorRootRef.current);
      if (!editor) return;
      applyDirectionToSelection(
        editor,
        event.code === "ShiftLeft" ? "ltr" : "rtl",
      );
    },
    [readOnly, disabled, loading, isSaving],
  );

  const handleKeyUp = useCallback((event: React.KeyboardEvent) => {
    if (
      event.ctrlKey &&
      (event.code === "ShiftLeft" || event.code === "ShiftRight")
    ) {
      event.preventDefault();
    }
  }, []);

  const mergedStyle = useMemo<React.CSSProperties>(
    () => ({
      width: "100%",
      height: "100%",
      outline: 0,
      borderRadius: 8,
      // Inherited by the contenteditable and by new paragraphs.
      direction: DEFAULT_DIRECTION,
      textAlign: DEFAULT_ALIGNMENT,
      ...containerStyle,
    }),
    [containerStyle],
  );

  return (
    <>
      <div
        ref={editorRootRef}
        className={className}
        style={{ height: "100%" }}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
      >
        <Editor
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled || readOnly}
          containerProps={{
            dir: DEFAULT_DIRECTION,
            style: {
              fontFamily: "Tahoma, Arial, sans-serif",
              border: `1px solid ${error ? palette.error.main : palette.divider}`,
              ...mergedStyle,
            },
          }}
        >
          <EditorToolbar
            label={label}
            disabled={disabled}
            loading={loading || isSaving}
            readOnly={readOnly}
            autoSaveEnabled={autoSave && !!onSave}
            autoSaveStatus={autoSaveStatus}
            changed={changed}
            onSave={handleSave}
            editorRootRef={editorRootRef}
          />
          {(loading || isSaving) && <LinearProgress />}
        </Editor>
      </div>

      {helperText && (
        <Typography
          variant="caption"
          color="error"
          sx={{ mt: 0.5, ml: 1.5, display: "block" }}
        >
          {helperText}
        </Typography>
      )}
    </>
  );
}

export default memo(AppEditor);
