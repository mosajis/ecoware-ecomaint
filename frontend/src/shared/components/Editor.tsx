import React, { useCallback, useMemo, memo, useState, useEffect } from "react";
import Editor, {
  Toolbar,
  BtnBold,
  BtnItalic,
  createButton,
  ContentEditableEvent,
} from "react-simple-wysiwyg";

// === دکمه‌های Align ===
const BtnAlignLeft = createButton("Align Left", "⬅", "justifyLeft");
const BtnAlignCenter = createButton("Align Center", "≡", "justifyCenter");
const BtnAlignRight = createButton("Align Right", "➡", "justifyRight");

// === دکمه‌های Undo / Redo ===
const BtnUndo = createButton("Undo", "↶", "undo");
const BtnRedo = createButton("Redo", "↷", "redo");

interface ReusableEditorProps {
  initValue?: string;
  onSave?: (currentValue: string) => Promise<void> | void;
  placeholder?: string;
  disabled?: boolean;
  containerStyle?: React.CSSProperties;
  className?: string;
}

// === Toolbar Memoized ===
const EditorToolbar = memo(
  ({
    onSave,
    disabled,
    loading,
  }: {
    onSave?: () => void;
    disabled: boolean;
    loading: boolean;
  }) => (
    <Toolbar
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div>
        <BtnBold />
        <BtnItalic />
        <BtnAlignLeft />
        <BtnAlignCenter />
        <BtnAlignRight />
        <BtnUndo />
        <BtnRedo />
      </div>

      {/* Save Button */}
      <div
        onClick={!disabled && !loading ? onSave : undefined}
        style={{
          padding: "4px 10px",
          margin: "0 4px",
          cursor: disabled || loading ? "not-allowed" : "pointer",
          fontSize: "14px",
          color: "black",
          fontWeight: "bold",
          borderRadius: "4px",
          opacity: disabled || loading ? 0.5 : 1,
          userSelect: "none",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
        title={loading ? "Saving..." : disabled ? "No changes" : "Save"}
      >
        {loading ? (
          <span
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              border: "2px solid #333",
              borderTop: "2px solid transparent",
              animation: "spin 0.7s linear infinite",
            }}
          />
        ) : (
          "✓"
        )}

        <style>
          {`@keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }`}
        </style>
      </div>
    </Toolbar>
  )
);

function AppEditorComponent({
  initValue = "",
  onSave,
  placeholder,
  disabled = false,
  containerStyle,
  className,
}: ReusableEditorProps) {
  const [value, setValue] = useState("");
  const [changed, setChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initial, setInitial] = useState("");

  // === Sync external changes
  useEffect(() => {
    setValue(initValue);
    setInitial(initValue);
    setChanged(false);
  }, [initValue]);

  const handleChange = useCallback(
    (e: ContentEditableEvent) => {
      const newVal = e.target.value;
      setValue(newVal);
      setChanged(newVal !== initial);
    },
    [initial]
  );

  const handleSave = useCallback(async () => {
    if (!onSave || !changed) return;

    try {
      setLoading(true);
      await onSave(value);

      // بعد از ذخیره کردن، وضعیت تغییرات صفر می‌شود
      setInitial(value);
      setChanged(false);
    } finally {
      setLoading(false);
    }
  }, [onSave, value, changed]);

  const mergedStyle = useMemo(
    () => ({ width: "100%", height: "100%", ...containerStyle }),
    [containerStyle]
  );

  return (
    <Editor
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      containerProps={{ style: mergedStyle }}
      className={className}
    >
      <EditorToolbar
        onSave={handleSave}
        disabled={!changed || disabled}
        loading={loading}
      />
    </Editor>
  );
}

export default memo(AppEditorComponent);
