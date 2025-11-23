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

type OwnerState = { expanded: boolean };

const StyledTextField = styled(TextField)<{ ownerState: OwnerState }>(
  ({ theme, ownerState }) => ({
    width: ownerState.expanded ? 260 : 0,
    opacity: ownerState.expanded ? 1 : 0,
    transition: theme.transitions.create(["width", "opacity"]),
  })
);

interface ButtonSearchProps {
  onSearch: (value: string) => void; // همیشه مقدار string
}

export default function ButtonSearch({ onSearch }: ButtonSearchProps) {
  const [expanded, setExpanded] = useState(false);
  const [value, setValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setValue(val);
      onSearch(val); // فقط string پاس میشه
    },
    [onSearch]
  );

  const handleClear = useCallback(() => {
    setValue("");
    onSearch(""); // وقتی پاک می‌کنیم هم string پاس میشه
    setExpanded(false);
  }, [onSearch]);

  const handleToggle = useCallback(() => setExpanded(true), []);

  useEffect(() => {
    if (expanded) inputRef.current?.focus();
  }, [expanded]);

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
    <Stack direction="row" spacing={1} alignItems="center" ref={containerRef}>
      {!expanded && (
        <Tooltip title="Search">
          <IconButton size="small" onClick={handleToggle}>
            <SearchIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      <Box sx={{ position: "relative" }}>
        <StyledTextField
          size="small"
          placeholder="Search..."
          value={value}
          onChange={handleChange}
          inputRef={inputRef}
          ownerState={{ expanded }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: value && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleClear}>
                  <CancelIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Stack>
  );
}
