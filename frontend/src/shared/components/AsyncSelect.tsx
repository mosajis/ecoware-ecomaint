import { useState, useCallback, useRef } from "react";
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
  const loadedOnceRef = useRef(false); // ✅ track if loaded once

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

  const handleOpen = () => {
    // فقط دفعه اول باز شدن
    if (!loadedOnceRef.current) {
      loadOptions("");
      loadedOnceRef.current = true;
    }
  };

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
          onInputChange={(_, value, reason) => {
            setInputValue(value);
            if (reason === "input") loadOptions(value); // فقط وقتی کاربر تایپ می‌کنه
          }}
          disabled={disabled}
          loading={loading}
          onOpen={handleOpen}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params: AutocompleteRenderInputParams) => (
            <TextField
              {...params}
              label={label}
              size="small"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading && <CircularProgress color="inherit" size={20} />}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          sx={{
            "& .MuiAutocomplete-endAdornment .MuiIconButton-root": {
              backgroundColor: "transparent",
              "&:hover": {
                backgroundColor: "transparent",
              },
            },
            ...sx,
          }}
        />
      )}
    />
  );
}
