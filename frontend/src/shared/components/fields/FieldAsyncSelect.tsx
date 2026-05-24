import { Controller, Control } from "react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import debounce from "lodash-es/debounce";
import {
  useState,
  useCallback,
  useRef,
  useEffect,
  ReactNode,
  useMemo,
} from "react";
import { DynamicQuery, DynamicResponse } from "@/core/api/dynamicTypes";

export type SelectionMode = "single" | "multiple";

export interface AsyncSelectProps<T> {
  name?: string;
  control?: Control<any>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean; // 👈 اضافه شد
  sx?: any;
  selectionMode?: SelectionMode;
  value?: any | null;
  initialOptions?: T[];
  error?: boolean;
  helperText?: ReactNode;
  request: (query?: DynamicQuery<any>) => DynamicResponse<any>;
  extractRows?: (data: any) => T[];
  getOptionLabel?: (row: T) => string;
  getOptionKey?: (row: T) => string | number;
  onChange?: (value: T | T[] | null) => void;
  enableClientSideFilter?: boolean;
  minCharsToSearch?: number;
}

export default function FieldAsyncSelect<T>({
  name,
  control,
  label,
  placeholder,
  disabled = false,
  readOnly = false, // 👈 اضافه شد
  sx,
  selectionMode = "single",
  value,
  initialOptions = [],
  error,
  helperText,
  request,
  extractRows = (data: any) => data?.items ?? [],
  getOptionLabel = (row: any) => row?.label ?? String(row),
  getOptionKey = (row: any) => row?.id ?? getOptionLabel(row),
  onChange,
  enableClientSideFilter = true,
  minCharsToSearch = 0,
}: AsyncSelectProps<T>) {
  const multiple = selectionMode === "multiple";

  const [allOptions, setAllOptions] = useState<T[]>(initialOptions);
  const [filteredOptions, setFilteredOptions] = useState<T[]>(initialOptions);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const cacheRef = useRef<{
    loaded: boolean;
    data: T[];
  }>({
    loaded: false,
    data: initialOptions,
  });

  const mergeOptions = (existing: T[], newOptions: T[]): T[] => {
    const map = new Map<string | number, T>();

    existing.forEach((opt) => {
      const key = getOptionKey(opt);
      map.set(key, opt);
    });

    newOptions.forEach((opt) => {
      const key = getOptionKey(opt);
      map.set(key, opt);
    });

    return Array.from(map.values());
  };

  useEffect(() => {
    if (initialOptions.length > 0) {
      const mergedOptions = mergeOptions(cacheRef.current.data, initialOptions);
      cacheRef.current.data = mergedOptions;
      setAllOptions(mergedOptions);
      setFilteredOptions(mergedOptions);
    }
  }, [initialOptions]);

  const filterOptionsLocally = useCallback(
    (query: string) => {
      if (!query || !enableClientSideFilter) {
        return allOptions;
      }

      const lowerQuery = query.toLowerCase();
      return allOptions.filter((option) =>
        getOptionLabel(option).toLowerCase().includes(lowerQuery),
      );
    },
    [allOptions, enableClientSideFilter, getOptionLabel],
  );

  const loadOptionsFromServer = useCallback(async () => {
    if (cacheRef.current.loaded || loading) return;

    setLoading(true);
    try {
      const res = await request("");
      const rows = extractRows(res);
      const merged = mergeOptions(cacheRef.current.data, rows);

      cacheRef.current.data = merged;
      cacheRef.current.loaded = true;

      setAllOptions(merged);
      setFilteredOptions(merged);
    } catch (error) {
      console.error("Error loading options:", error);
    } finally {
      setLoading(false);
    }
  }, [request, extractRows, loading]);

  const searchOnServer = useMemo(
    () =>
      debounce(async (query: string) => {
        if (enableClientSideFilter) return;

        setLoading(true);
        try {
          const res = await request(query);
          const rows = extractRows(res);
          setFilteredOptions(rows);
        } catch (error) {
          console.error("Error searching options:", error);
        } finally {
          setLoading(false);
        }
      }, 400),
    [request, extractRows, enableClientSideFilter],
  );

  useEffect(() => {
    return () => {
      searchOnServer.cancel();
    };
  }, [searchOnServer]);

  const handleOpen = () => {
    if (readOnly) return;
    loadOptionsFromServer();
  };

  const handleInputChange = (newValue: string, reason: string) => {
    if (readOnly) return;

    setInputValue(newValue);

    if (reason !== "input") return;

    if (enableClientSideFilter) {
      if (newValue.length >= minCharsToSearch) {
        const filtered = filterOptionsLocally(newValue);
        setFilteredOptions(filtered);
      } else {
        setFilteredOptions(allOptions);
      }
    } else {
      if (newValue.length >= minCharsToSearch) {
        searchOnServer(newValue);
      }
    }
  };

  const handleChange = (
    selected: T | T[] | null,
    fieldOnChange?: (value: any) => void,
  ) => {
    if (readOnly) return;

    fieldOnChange?.(selected);
    onChange?.(selected);
  };

  const renderAutocomplete = (field?: any) => (
    <Autocomplete<T, boolean, false, false>
      multiple={multiple}
      options={filteredOptions}
      value={field?.value ?? value ?? (multiple ? [] : null)}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={(option, val) =>
        getOptionKey(option) === getOptionKey(val)
      }
      fullWidth
      disabled={disabled}
      readOnly={readOnly}
      onChange={(_, v) => handleChange(v, field?.onChange)}
      inputValue={inputValue}
      onInputChange={(_, newValue, reason) =>
        handleInputChange(newValue, reason)
      }
      onOpen={readOnly ? undefined : handleOpen}
      loading={loading}
      filterOptions={(x) => x}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          size="small"
          error={error}
          helperText={helperText}
          InputProps={{
            ...params.InputProps,
            readOnly, // 👈 جلوگیری از تایپ
            endAdornment: (
              <>
                {loading && <CircularProgress size={20} color="inherit" />}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      sx={sx}
    />
  );

  if (control && name) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => renderAutocomplete(field)}
      />
    );
  }

  return renderAutocomplete();
}
