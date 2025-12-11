import { alpha, useColorScheme, useTheme } from "@mui/material";
import React, {
  useCallback,
  memo,
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";
import Editor, {
  Toolbar,
  BtnBold,
  BtnItalic,
  createButton,
  ContentEditableEvent,
} from "react-simple-wysiwyg";

// === Custom Buttons ===
const BtnAlignLeft = createButton("Align Left", "⬅", "justifyLeft");
const BtnAlignCenter = createButton("Align Center", "≡", "justifyCenter");
const BtnAlignRight = createButton("Align Right", "➡", "justifyRight");
const BtnUndo = createButton("Undo", "↶", "undo");
const BtnRedo = createButton("Redo", "↷", "redo");

// === Types ===
interface AppEditorProps {
  initValue?: string;
  onSave?: (currentValue: string) => Promise<void> | void;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  containerStyle?: React.CSSProperties;
  className?: string;
  autoSave?: boolean;
  autoSaveDelay?: number;
}

// ======================================================
// Helpers
// ======================================================

const getButtonColors = (theme: any, disabled: boolean) => {
  if (disabled) return { bg: "transparent", bgHover: "transparent" };

  const main = theme.vars?.palette?.primary?.mainChannel || "0 0 0";

  return {
    bg: `rgba(${main} / 0.08)`,
    bgHover: `rgba(${main} / 0.15)`,
  };
};

const dividerStyle = (theme: any) => ({
  width: "1px",
  height: "24px",
  backgroundColor: (theme.vars || theme).palette.divider,
  margin: "0 4px",
});

const EditorToolbar = memo(
  ({
    onSave,
    disabled,
    loading,
    readOnly,
    autoSaveEnabled,
    autoSaveStatus,
  }: {
    onSave?: () => void;
    disabled: boolean;
    loading: boolean;
    readOnly: boolean;
    autoSaveEnabled: boolean;
    autoSaveStatus: "idle" | "saving" | "saved";
  }) => {
    const theme = useTheme();
    const { mode, setMode } = useColorScheme();
    const rightBtnColors = getButtonColors(theme, disabled || loading);

    const saveBtnStyle: React.CSSProperties = {
      padding: "6px 12px",
      cursor: disabled || loading ? "not-allowed" : "pointer",
      fontSize: "14px",
      fontWeight: "bold",
      borderRadius: "4px",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      border: `1px solid ${(theme.vars || theme).palette.divider}`,
      opacity: disabled || loading ? 0.6 : 1,
      color:
        disabled || loading
          ? (theme.vars || theme).palette.text.disabled
          : (theme.vars || theme).palette.primary.main,
      transition: "background-color 0.3s ease",
    };

    return (
      <Toolbar
        style={{
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: (theme.vars || theme).palette.background.paper,
          borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
          padding: "0 8px",
          height: 45,
          flexWrap: "wrap",
        }}
      >
        {/* Formatting buttons */}
        <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
          <BtnBold style={{ color: mode === "light" ? "#333" : "white" }} />
          <BtnItalic style={{ color: mode === "light" ? "#333" : "white" }} />

          <div style={dividerStyle(theme)} />

          <BtnAlignLeft
            style={{ color: mode === "light" ? "#333" : "white" }}
          />
          <BtnAlignCenter
            style={{ color: mode === "light" ? "#333" : "white" }}
          />
          <BtnAlignRight
            style={{ color: mode === "light" ? "#333" : "white" }}
          />

          <div style={dividerStyle(theme)} />

          <BtnUndo style={{ color: mode === "light" ? "#333" : "white" }} />
          <BtnRedo style={{ color: mode === "light" ? "#333" : "white" }} />
        </div>

        {/* Right side: autosave + manual save */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {autoSaveEnabled && (
            <div
              style={{
                fontSize: "12px",
                opacity: 0.7,
                display: "flex",
                gap: "4px",
              }}
            >
              {autoSaveStatus === "saving" && (
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    border: "2px solid currentColor",
                    borderTop: "2px solid transparent",
                    animation: "spin .7s linear infinite",
                  }}
                />
              )}
              {autoSaveStatus === "saved" && <span>✓</span>}
              {autoSaveStatus === "idle" && <span>●</span>}
              <span>Auto-save</span>
            </div>
          )}

          {!readOnly && !autoSaveEnabled && (
            <button
              onClick={onSave}
              disabled={disabled || loading}
              style={saveBtnStyle}
              title={loading ? "Saving..." : disabled ? "No changes" : "Save"}
              onMouseEnter={(e) =>
                !disabled &&
                !loading &&
                (e.currentTarget.style.backgroundColor = rightBtnColors.bgHover)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = rightBtnColors.bg)
              }
            >
              {loading ? (
                <span
                  style={{
                    width: "14px",
                    height: "14px",
                    borderRadius: "50%",
                    border: "2px solid currentColor",
                    borderTop: "2px solid transparent",
                    animation: "spin .7s linear infinite",
                  }}
                />
              ) : (
                "✓ Save"
              )}
            </button>
          )}
        </div>

        <style>
          {`@keyframes spin { from {transform:rotate(0)} to {transform:rotate(360deg)} }`}
        </style>
      </Toolbar>
    );
  }
);

// ======================================================
// Main Component
// ======================================================

function AppEditor({
  initValue = "",
  onSave,
  placeholder = "Start typing...",
  disabled = false,
  readOnly = false,
  containerStyle,
  className,
  autoSave = true,
  autoSaveDelay = 2000,
}: AppEditorProps) {
  const theme = useTheme();

  const [value, setValue] = useState("");
  const [initial, setInitial] = useState("");
  const [changed, setChanged] = useState(false);
  const [loading, setLoading] = useState(false);

  const [autoSaveStatus, setAutoSaveStatus] = useState<
    "idle" | "saving" | "saved"
  >("idle");

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Sync initial value
  useEffect(() => {
    setValue(initValue);
    setInitial(initValue);
    setChanged(false);
  }, [initValue]);

  // --------------------------------------------------
  // Handlers
  // --------------------------------------------------

  const handleAutoSave = useCallback(
    async (content: string) => {
      if (!onSave) return;

      try {
        setAutoSaveStatus("saving");
        await onSave(content);
        setInitial(content);
        setChanged(false);
        setAutoSaveStatus("saved");

        setTimeout(() => setAutoSaveStatus("idle"), 2000);
      } catch (err) {
        console.error("Auto-save failed:", err);
        setAutoSaveStatus("idle");
      }
    },
    [onSave]
  );

  const handleChange = useCallback(
    (e: ContentEditableEvent) => {
      if (readOnly) return;

      const newVal = e.target.value;
      setValue(newVal);
      const hasChanged = newVal !== initial;
      setChanged(hasChanged);

      if (autoSave && hasChanged && onSave) {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        setAutoSaveStatus("idle");

        debounceRef.current = setTimeout(() => {
          handleAutoSave(newVal);
        }, autoSaveDelay);
      }
    },
    [initial, autoSave, autoSaveDelay, onSave, readOnly]
  );

  const handleSave = useCallback(async () => {
    if (!onSave || !changed) return;

    try {
      setLoading(true);
      await onSave(value);
      setInitial(value);
      setChanged(false);
    } finally {
      setLoading(false);
    }
  }, [changed, value, onSave]);

  // --------------------------------------------------
  // Styles
  // --------------------------------------------------

  const mergedStyle = useMemo<React.CSSProperties>(
    () => ({
      width: "100%",
      height: "100%",
      outline: 0,
      borderRadius: 8,
      ...containerStyle,
    }),
    [containerStyle]
  );

  return (
    <Editor
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled || readOnly}
      containerProps={{
        style: {
          border: `1px solid ${(theme.vars || theme).palette.divider}`,
          ...mergedStyle,
        },
      }}
    >
      <EditorToolbar
        onSave={handleSave}
        disabled={!changed || disabled}
        loading={loading}
        readOnly={readOnly}
        autoSaveEnabled={autoSave}
        autoSaveStatus={autoSaveStatus}
      />
    </Editor>
  );
}

export default memo(AppEditor);
