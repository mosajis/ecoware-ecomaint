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
  onSave?: (currentValue: string) => void;
  placeholder?: string;
  disabled?: boolean;
  containerStyle?: React.CSSProperties;
  className?: string;
}

// === Toolbar Memoized ===
const EditorToolbar = memo(({ onSave }: { onSave?: () => void }) => (
  <Toolbar>
    <BtnBold />
    <BtnItalic />
    <BtnAlignLeft />
    <BtnAlignCenter />
    <BtnAlignRight />
    <BtnUndo />
    <BtnRedo />
    {onSave && (
      <button
        onClick={onSave}
        style={{
          padding: "4px 8px",
          margin: "0 4px",
          backgroundColor: "#1976d2",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "14px",
        }}
        title="Save"
      >
        ✓
      </button>
    )}
  </Toolbar>
));

function AppEditorComponent({
  initValue = "",
  onSave,
  placeholder,
  disabled = false,
  containerStyle,
  className,
}: ReusableEditorProps) {
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(initValue);
  }, [initValue]);
  const handleChange = useCallback((e: ContentEditableEvent) => {
    setValue(e.target.value);
  }, []);

  const handleSave = useCallback(() => {
    if (onSave) onSave(value);
  }, [onSave, value]);

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
      <EditorToolbar onSave={handleSave} />
    </Editor>
  );
}

export default memo(AppEditorComponent);
