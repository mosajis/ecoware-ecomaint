import TextField, { TextFieldProps } from "@mui/material/TextField";

type RHFField = {
  value: number | null;
  onChange: (value: number | null) => void;
  onBlur?: () => void;
  name?: string;
};

type NumberFieldProps = Omit<TextFieldProps, "value" | "onChange" | "type"> & {
  label: string;
  readOnly?: boolean;
  field?: RHFField;

  value?: number | null;
  onChange?: (value: number | null) => void;
};

const FieldNumber = ({
  label,
  field,
  value,
  readOnly = false,
  onChange,
  ...restProps
}: NumberFieldProps) => {
  const isRHF = Boolean(field);

  const resolvedValue = isRHF ? field!.value : value;
  const resolvedOnChange = isRHF ? field!.onChange : onChange;

  return (
    <TextField
      {...restProps}
      size="small"
      label={label}
      type="number"
      InputProps={{
        readOnly,
      }}
      value={resolvedValue ?? ""}
      onChange={(e) => {
        const val = e.target.value;
        resolvedOnChange?.(val === "" ? null : Number(val));
      }}
      onBlur={field?.onBlur}
      name={field?.name}
    />
  );
};

export default FieldNumber;
