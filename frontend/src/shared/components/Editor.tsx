import React, { useCallback, useMemo, memo } from "react";
import Editor, {
  Toolbar,
  BtnBold,
  BtnItalic,
  createButton,
  EditorProvider,
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
  value: string;
  onChange: (e: ContentEditableEvent) => void;
  placeholder?: string;
  disabled?: boolean;
  containerStyle?: React.CSSProperties;
  className?: string;
}

// === Toolbar Memoized ===
const EditorToolbar = memo(() => (
  <Toolbar>
    <BtnBold />
    <BtnItalic />
    <BtnAlignLeft />
    <BtnAlignCenter />
    <BtnAlignRight />
    <BtnUndo />
    <BtnRedo />
  </Toolbar>
));

function AppEditorComponent({
  value,
  onChange,
  placeholder,
  disabled = false,
  containerStyle,
  className,
}: ReusableEditorProps) {
  // callback memoized برای جلوگیری از re-render غیرضروری
  const handleChange = useCallback(
    (e: ContentEditableEvent) => {
      onChange(e);
    },
    [onChange]
  );

  // استایل نهایی با useMemo
  const mergedStyle = useMemo(
    () => ({ width: "100%", height: "100%", ...containerStyle }),
    [containerStyle]
  );

  return (
    <EditorProvider>
      <Editor
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        containerProps={{ style: mergedStyle }}
        className={className}
      >
        <EditorToolbar />
      </Editor>
    </EditorProvider>
  );
}

// export با React.memo برای جلوگیری از رندرهای غیرضروری
export default memo(AppEditorComponent);
