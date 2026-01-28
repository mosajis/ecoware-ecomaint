import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

interface SearchPopperProps {
  onSearch?: (value: string) => void;
  debounceMs?: number;
}

const SearchPopper: React.FC<SearchPopperProps> = ({
  onSearch,
  debounceMs = 250,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [value, setValue] = useState("");
  const debounceRef = useRef<number | undefined>(undefined);

  const open = Boolean(anchorEl);
  const id = open ? "search-popper" : undefined;

  const handleToggle = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl((prev) => (prev ? null : event.currentTarget));
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (!onSearch) return;

    window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      onSearch(value);
    }, debounceMs);

    return () => window.clearTimeout(debounceRef.current);
  }, [value, onSearch, debounceMs]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      if (value) {
        setValue("");
      } else {
        handleClose();
      }
    }
  };

  return (
    <>
      <IconButton size="small" onClick={handleToggle} aria-describedby={id}>
        <SearchIcon />
      </IconButton>

      <Popper
        id={id}
        open={open}
        anchorEl={anchorEl}
        sx={{ zIndex: 1 }}
        placement="bottom-start"
        modifiers={[
          {
            name: "offset",
            options: {
              offset: [0, 6],
            },
          },
        ]}
      >
        <Box
          sx={{
            p: 1,
            minWidth: 220,
            bgcolor: "background.paper",
            borderRadius: 1,
            boxShadow: 3,
          }}
        >
          <TextField
            size="small"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Search..."
            autoFocus
            fullWidth
            onKeyDown={handleKeyDown}
            InputProps={{
              endAdornment: value ? (
                <InputAdornment position="end">
                  <IconButton
                    sx={{ border: 0 }}
                    size="small"
                    onClick={() => setValue("")}
                    edge="end"
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
          />
        </Box>
      </Popper>
    </>
  );
};

export default SearchPopper;
