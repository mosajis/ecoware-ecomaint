import { memo, useCallback, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Popper from "@mui/material/Popper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";

interface SearchPopperProps {
  onApply: (value: string) => void;
  onCancel: () => void;
}

function SearchPopperBase({ onApply, onCancel }: SearchPopperProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [value, setValue] = useState("");
  const [applied, setApplied] = useState(false);

  const open = Boolean(anchorEl);

  const handleToggle = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget;
    setAnchorEl((prev) => (prev ? null : target));
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleCancel = useCallback(() => {
    setValue("");
    setApplied(false);
    setAnchorEl(null);
    onCancel();
  }, [onCancel]);

  const handleOk = useCallback(() => {
    const query = value.trim();

    if (query.length < 4) return;

    setApplied(true);
    setAnchorEl(null);
    onApply(query);
  }, [value, onApply]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleOk();
      }

      if (e.key === "Escape") {
        e.preventDefault();
        handleCancel();
      }
    },
    [handleOk, handleCancel],
  );

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Box sx={{ display: "inline-flex" }}>
        <IconButton
          size="small"
          onClick={handleToggle}
          color={applied ? "primary" : "default"}
          aria-label="Search"
        >
          <SearchIcon />
        </IconButton>

        <Popper
          id="search-popper"
          open={open}
          anchorEl={anchorEl}
          placement="bottom-start"
          disablePortal
          sx={{ zIndex: (theme) => theme.zIndex.modal }}
          modifiers={[
            {
              name: "offset",
              options: { offset: [0, 6] },
            },
          ]}
        >
          <Box
            sx={{
              p: 1,
              minWidth: 280,
              bgcolor: "background.paper",
              borderRadius: 1,
              boxShadow: 3,
            }}
          >
            <TextField
              size="small"
              fullWidth
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search (min. 4 characters)..."
              slotProps={{
                input: {
                  endAdornment: value ? (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        edge="end"
                        onClick={() => setValue("")}
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                },
              }}
            />

            <Stack
              direction="row"
              spacing={1}
              justifyContent="flex-end"
              sx={{ mt: 1 }}
            >
              <Button size="small" variant="outlined" onClick={handleCancel}>
                Cancel
              </Button>

              <Button
                size="small"
                onClick={handleOk}
                disabled={value.trim().length < 4}
              >
                OK
              </Button>
            </Stack>
          </Box>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
}

export default memo(SearchPopperBase);
