import { useState, useCallback, useRef, useEffect } from "react";
import { styled } from "@mui/material/styles";
import {
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Stack,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from "@mui/icons-material/Cancel";

interface ButtonSearchProps {
  onSearch: (value: string) => void;
}

interface OwnerState {
  expanded: boolean;
}

/* --------------------------------------------------
   Wrapper → مدیریت فضای واقعی
   -------------------------------------------------- */
const FieldWrapper = styled("div")<{ expanded: boolean }>(({ expanded }) => ({
  display: "grid",
  gridTemplateColumns: "1fr",
  position: "relative",

  // تعیین مقدار width در حالت بسته
  "--trigger-width": expanded ? "260px" : "0px",
}));

/* --------------------------------------------------
   TextField → استایل دقیق طبق درخواست شما
   -------------------------------------------------- */
const StyledTextField = styled(TextField)<{ ownerState: OwnerState }>(
  ({ theme, ownerState }) => ({
    gridArea: "1 / 1",
    overflowX: "clip",
    width: ownerState.expanded ? 260 : "var(--trigger-width)",
    opacity: ownerState.expanded ? 1 : 0,

    transition: theme.transitions.create(["width", "opacity"], {
      duration: 200,
    }),

    // رفع min-width پیش‌فرض MUI
    "& .MuiInputBase-root": {
      minWidth: 0,
      height: 36,
    },
  })
);

export default function ButtonSearch({ onSearch }: ButtonSearchProps) {
  const [expanded, setExpanded] = useState(false);
  const [value, setValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* ---------------- handle change ---------------- */
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setValue(val);
      onSearch(val);
    },
    [onSearch]
  );

  /* ---------------- clear ---------------- */
  const handleClear = useCallback(() => {
    setValue("");
    onSearch("");
    setExpanded(false);
  }, [onSearch]);

  /* ---------------- focus when open ---------------- */
  useEffect(() => {
    if (expanded) {
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [expanded]);

  /* ---------------- close if clicked outside ---------------- */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        expanded &&
        !value &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [expanded, value]);

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={expanded ? 1 : 0}
      ref={containerRef}
    >
      {!expanded && (
        <Tooltip title="Search">
          <IconButton size="small" onClick={() => setExpanded(true)}>
            <SearchIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      <FieldWrapper expanded={expanded}>
        <StyledTextField
          ownerState={{ expanded }}
          size="small"
          placeholder="Search…"
          value={value}
          onChange={handleChange}
          inputRef={inputRef}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: value && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={handleClear}
                  sx={{ border: 0 }}
                >
                  <CancelIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </FieldWrapper>
    </Stack>
  );
}
