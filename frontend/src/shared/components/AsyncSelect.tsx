import { useState, useCallback } from "react";
import { Controller, Control } from "react-hook-form";
import { TextField, CircularProgress } from "@mui/material";
import Autocomplete, {
  AutocompleteRenderInputParams,
} from "@mui/material/Autocomplete";
import { debounce } from "lodash";

export interface AsyncSelectOption {
  id: number | string;
  label: string;
}

interface AsyncSelectProps<T> {
  name: string;
  control: Control<any>;
  label?: string;
  disabled?: boolean;
  multiple?: boolean;
  apiCall: () => Promise<T[]>; // fetch data
  mapper: (item: T) => AsyncSelectOption; // map to id/label
  sx?: any;
}

export default function AsyncSelect<T>({
  name,
  control,
  label,
  disabled,
  multiple = false,
  apiCall,
  mapper,
  sx,
}: AsyncSelectProps<T>) {
  const [options, setOptions] = useState<AsyncSelectOption[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  // Debounced load function for search
  const loadOptions = useCallback(
    debounce(async (query: string) => {
      setLoading(true);
      try {
        const items = await apiCall();
        const mapped = items
          .map(mapper)
          .filter(
            (o) => !query || o.label.toLowerCase().includes(query.toLowerCase())
          );
        setOptions(mapped);
      } finally {
        setLoading(false);
      }
    }, 300),
    [apiCall, mapper]
  );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Autocomplete
          multiple={multiple}
          options={options}
          value={field.value || (multiple ? [] : null)}
          getOptionLabel={(option) => option.label}
          onChange={(_, value) => field.onChange(value)}
          inputValue={inputValue}
          onInputChange={(_, value) => {
            setInputValue(value);
            loadOptions(value);
          }}
          disabled={disabled}
          loading={loading}
          onOpen={() => loadOptions(inputValue)}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params: AutocompleteRenderInputParams) => (
            <TextField {...params} label={label} size="small" />
          )}
          sx={sx}
        />
      )}
    />
  );
}
