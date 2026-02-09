import React from "react";
import CalendarToday from "@mui/icons-material/CalendarToday";
import AccessTime from "@mui/icons-material/AccessTime";
import Event from "@mui/icons-material/Event";
import ClearIcon from "@mui/icons-material/Clear";
import { DatePicker, DateTimePicker, TimePicker } from "@mui/x-date-pickers";
import { DATE_FORMATS, DateTimeType } from "@/const";
import { useAtomValue } from "jotai";
import { atomLanguage } from "@/shared/atoms/general.atom";

interface DateFieldProps {
  label: string;
  field: any;
  disabled?: boolean;
  type?: DateTimeType;
  error?: boolean;
  helperText?: React.ReactNode;
}

const FieldDateTime: React.FC<DateFieldProps> = ({
  label,
  field,
  disabled = false,
  type = "DATE",
  error,
  helperText,
  ...restProps
}) => {
  const language = useAtomValue(atomLanguage);
  const locale = language === "fa" ? "FA" : "EN";

  const dateValue = field.value ? new Date(field.value) : null;

  const handleChange = (newValue: Date | null) => {
    field.onChange(newValue ? newValue.toISOString() : null);
  };

  const getIcon = () => {
    switch (type) {
      case "TIME":
        return AccessTime;
      case "DATETIME":
        return Event;
      default:
        return CalendarToday;
    }
  };

  const Picker =
    type === "TIME"
      ? TimePicker
      : type === "DATETIME"
        ? DateTimePicker
        : DatePicker;

  const iconStyle = {
    fontSize: 1,
    width: "18px",
    height: "18px",
    borderRadius: "5px",
  };

  const buttonStyle = {
    p: 0,
    width: "28px !important",
    height: "28px !important",
  };

  return (
    <Picker
      {...restProps}
      label={label}
      value={dateValue}
      onChange={handleChange}
      disabled={disabled}
      format={DATE_FORMATS[locale][type]}
      slots={{
        openPickerIcon: getIcon(),
        clearIcon: ClearIcon,
      }}
      slotProps={{
        field: { clearable: true },
        textField: {
          fullWidth: true,
          size: "small",
          error,
          helperText,
        },
        openPickerIcon: { sx: iconStyle },
        clearIcon: { sx: iconStyle },
        openPickerButton: { sx: { ...buttonStyle, marginRight: "-8px" } },
        clearButton: { sx: buttonStyle },
      }}
      {...((type === "TIME" || type === "DATETIME") && {
        ampm: false,
        timeSteps: { minutes: 1 },
      })}
    />
  );
};

export default FieldDateTime;
