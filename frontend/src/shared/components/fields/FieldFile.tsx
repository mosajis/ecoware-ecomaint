import { formatFileSize } from "@/core/helper";
import React, {
  useState,
  useRef,
  ReactNode,
  ChangeEvent,
  DragEvent,
  MouseEvent,
  CSSProperties,
} from "react";

interface ClearIconButtonProps {
  title?: string;
  children?: ReactNode;
}

interface FileFieldProps {
  label?: string;
  multiple?: boolean;
  accept?: string;
  hideSizeText?: boolean;
  getInputText?: (value: File | File[] | null) => string;
  getSizeText?: (value: File | File[] | null) => string;
  clearIconButtonProps?: ClearIconButtonProps;
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
  error?: boolean;
  placeholder?: string;
  onChange: (value: File | File[] | null) => void;
  maxSize?: number;
  className?: string;
}

const FieldFile = React.forwardRef<HTMLInputElement, FileFieldProps>(
  (props, ref) => {
    const {
      label = "Upload File",
      multiple = false,
      accept = ".pdf,.docx,.doc,.xlsx,.xls,.csv,.txt,.jpg,.jpeg,.png,.gif,.webp,.bmp",
      hideSizeText = false,
      getInputText,
      getSizeText,
      clearIconButtonProps,
      disabled = false,
      required = false,
      helperText,
      error = false,
      placeholder = "Click to upload or drag and drop",
      onChange,
      maxSize = 30 * 1024 * 1024,
      className = "",
      ...rest
    } = props;

    const [currentValue, setCurrentValue] = useState<File | File[] | null>(
      multiple ? [] : null,
    );
    const [isDragOver, setIsDragOver] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (files: FileList | null): void => {
      if (!files || files.length === 0) return;

      const fileList: File[] = Array.from(files);

      // بررسی سایز
      if (maxSize) {
        const oversized = fileList.filter((f) => f.size > maxSize);
        if (oversized.length > 0) {
          console.warn(`Files exceeding ${maxSize} bytes detected`);
          return;
        }
      }

      const newValue: File | File[] | null = multiple
        ? fileList
        : fileList[0] || null;

      setCurrentValue(newValue);
      onChange(newValue); // فقط بفرست بیرون
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
      handleFileChange(e.target.files);
    };

    const handleClear = (e: MouseEvent<HTMLButtonElement>): void => {
      e.stopPropagation();
      const emptyValue: File | File[] | null = multiple ? [] : null;

      setCurrentValue(emptyValue);
      onChange(emptyValue); // فقط بفرست بیرون

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(true);
    };

    const handleDragLeave = (): void => {
      setIsDragOver(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      handleFileChange(e.dataTransfer.files);
    };

    const renderContent = (): string => {
      if (
        !currentValue ||
        (Array.isArray(currentValue) && currentValue.length === 0)
      ) {
        return placeholder;
      }

      if (getInputText) {
        return getInputText(currentValue);
      }

      if (multiple && Array.isArray(currentValue)) {
        return `${currentValue.length} file${
          currentValue.length !== 1 ? "s" : ""
        } selected`;
      }

      return (currentValue as File)?.name || placeholder;
    };

    const renderSizeText = (): string | null => {
      if (hideSizeText || !currentValue) return null;

      if (getSizeText) {
        return getSizeText(currentValue);
      }

      if (multiple && Array.isArray(currentValue)) {
        const totalSize = (currentValue as File[]).reduce(
          (sum, f) => sum + f.size,
          0,
        );
        return formatFileSize(totalSize);
      }

      return formatFileSize((currentValue as File)?.size || 0);
    };

    const hasValue: boolean =
      !!currentValue &&
      (Array.isArray(currentValue) ? currentValue.length > 0 : true);

    const containerStyle: CSSProperties = {
      position: "relative",
    };

    const wrapperStyle: CSSProperties = {
      position: "relative",
      transition: "background-color 0.2s ease",
      backgroundColor: isDragOver ? "#f0f4ff" : "transparent",
    };

    const inputBoxStyle: CSSProperties = {
      width: "100%",
      padding: "12px 16px",
      border: `1px solid ${error ? "#ef4444" : "#d1d5db"}`,
      borderRadius: "8px",
      backgroundColor: error ? "#fef2f2" : disabled ? "#f3f4f6" : "white",
      cursor: disabled ? "not-allowed" : "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      userSelect: "none",
      opacity: disabled ? 0.6 : 1,
      transition: "all 0.2s ease",
    };

    const inputBoxHoverStyle: CSSProperties = disabled
      ? {}
      : {
          backgroundColor: isDragOver ? "#f0f4ff" : "#f9fafb",
        };

    const iconStyle: CSSProperties = {
      width: "20px",
      height: "20px",
      flexShrink: 0,
      color: error ? "#ef4444" : "#9ca3af",
      marginRight: "8px",
    };

    const contentWrapperStyle: CSSProperties = {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      flex: 1,
      minWidth: 0,
    };

    const contentStyle: CSSProperties = {
      flex: 1,
      minWidth: 0,
    };

    const labelStyle: CSSProperties = {
      display: "block",
      fontSize: "14px",
      fontWeight: "bold",
      color: "#374151",
      marginBottom: "4px",
    };

    const textStyle: CSSProperties = {
      fontSize: "14px",
      color: "#4b5563",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    };

    const clearButtonStyle: CSSProperties = {
      flexShrink: 0,
      marginLeft: "8px",
      padding: "6px",
      borderRadius: "6px",
      border: "none",
      backgroundColor: "transparent",
      cursor: disabled ? "not-allowed" : "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "background-color 0.2s ease",
      opacity: disabled ? 0.5 : 1,
    };

    const dragOverlayStyle: CSSProperties = {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "none",
    };

    const dragOverlayTextStyle: CSSProperties = {
      fontSize: "14px",
      fontWeight: 500,
      color: "#2563eb",
    };

    const sizeTextStyle: CSSProperties = {
      margin: "0",
      fontSize: "12px",
      color: "#6b7280",
    };

    const helperTextStyle: CSSProperties = {
      fontSize: "12px",
      color: error ? "#dc2626" : "#6b7280",
      marginTop: "6px",
      marginBottom: "0",
    };

    return (
      <div style={containerStyle} className={className}>
        <input
          ref={(instance) => {
            inputRef.current = instance;
            if (typeof ref === "function") {
              ref(instance);
            } else if (ref) {
              ref.current = instance;
            }
          }}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleInputChange}
          style={{ display: "none" }}
          disabled={disabled}
          {...rest}
        />

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={wrapperStyle}
        >
          <div
            onClick={() => !disabled && inputRef.current?.click()}
            style={{
              ...inputBoxStyle,
              ...inputBoxHoverStyle,
              borderColor: isDragOver
                ? "#3b82f6"
                : error
                  ? "#ef4444"
                  : "#d1d5db",
            }}
            onMouseEnter={(e) => {
              if (!disabled) {
                (e.currentTarget as HTMLDivElement).style.backgroundColor =
                  "#f9fafb";
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor =
                isDragOver ? "#f0f4ff" : error ? "#fef2f2" : "white";
            }}
          >
            <div style={contentWrapperStyle}>
              <svg
                style={iconStyle}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <div style={contentStyle}>
                {label && <label style={labelStyle}>{label}</label>}

                <div style={textStyle}>
                  {renderContent()}
                  {!hideSizeText && hasValue && (
                    <p style={sizeTextStyle}>{renderSizeText()}</p>
                  )}
                </div>
              </div>
            </div>

            {hasValue && (
              <div>
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={disabled}
                  style={clearButtonStyle}
                  onMouseEnter={(e) => {
                    if (!disabled) {
                      (
                        e.currentTarget as HTMLButtonElement
                      ).style.backgroundColor = "#e5e7eb";
                    }
                  }}
                  onMouseLeave={(e) => {
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = "transparent";
                  }}
                  title={clearIconButtonProps?.title || "Clear"}
                >
                  {clearIconButtonProps?.children ? (
                    clearIconButtonProps.children
                  ) : (
                    <svg
                      style={{
                        width: "20px",
                        height: "20px",
                        color: "#6b7280",
                      }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                </button>
              </div>
            )}
          </div>

          {isDragOver && (
            <div style={dragOverlayStyle}>
              <span style={dragOverlayTextStyle}>Drop files here</span>
            </div>
          )}
        </div>

        {helperText && <p style={helperTextStyle}>{helperText}</p>}
      </div>
    );
  },
);

export default FieldFile;
