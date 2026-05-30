import React from "react";
import CalendarToday from "@mui/icons-material/CalendarToday";
import AccessTime from "@mui/icons-material/AccessTime";
import Event from "@mui/icons-material/Event";
import ClearIcon from "@mui/icons-material/Clear";
import { DATE_FORMATS, DateTimeType } from "@/const";
import { useAtomValue } from "jotai";
import { atomLanguage } from "@/shared/atoms/general.atom";
import {
  DatePicker,
  DatePickerProps,
  DateTimePicker,
  DateTimePickerProps,
  TimePicker,
  TimePickerProps,
} from "@mui/x-date-pickers";

interface DateFieldProps {
  label: string;
  field: any; // بهتره بعداً نوع دقیق‌تر بذارید (مثلاً از react-hook-form)
  disabled?: boolean;
  type?: DateTimeType;
  error?: boolean;
  helperText?: React.ReactNode;
  // اجازه می‌دیم props خاص هر picker رو دریافت کنیم
  pickerProps?: Partial<
    DatePickerProps<any> & DateTimePickerProps<any> & TimePickerProps<any>
  >;
}

const FieldDateTime: React.FC<DateFieldProps> = ({
  label,
  field,
  disabled = false,
  type = "DATE",
  error,
  helperText,
  pickerProps = {}, // اسم بهتر و معنادارتر
  ...rest // اگر props دیگری هم پاس داده شد (خیلی کم پیش میاد)
}) => {
  const language = useAtomValue(atomLanguage);
  const locale = language === "fa" ? "FA" : "EN";

  const dateValue = (() => {
    if (!field.value) return null;

    if (type === "DATE" && typeof field.value === "string") {
      const [y, m, d] = field.value.slice(0, 10).split("-").map(Number);
      return new Date(y, m - 1, d);
    }

    return new Date(field.value);
  })();

  const handleChange = (newValue: Date | null) => {
    if (!newValue) {
      field.onChange(null);
      return;
    }

    if (type === "DATE") {
      const year = newValue.getFullYear();
      const month = String(newValue.getMonth() + 1).padStart(2, "0");
      const day = String(newValue.getDate()).padStart(2, "0");

      field.onChange(`${year}-${month}-${day}`);
      return;
    }

    field.onChange(newValue.toISOString());
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

  // انتخاب picker مناسب
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
      {...pickerProps}
      {...((type === "TIME" || type === "DATETIME") && {
        ampm: false,
        timeSteps: { minutes: 1 },
      })}
    />
  );
};

export default FieldDateTime;
