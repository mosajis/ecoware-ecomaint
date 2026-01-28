import Popover from "@mui/material/Popover";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useState, useRef } from "react";

const SearchPopover = ({
  onSearch,
}: {
  onSearch?: (value: string) => void;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchText, setSearchText] = useState("");
  const debounceRef = useRef<number | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleChange = (value: string) => {
    setSearchText(value);

    if (!onSearch) return;

    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(() => {
      onSearch(value);
    }, 250);
  };

  return (
    <>
      <IconButton size="small" onClick={handleClick}>
        <SearchIcon />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box p={1}>
          <TextField
            size="small"
            value={searchText}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Search..."
            autoFocus
          />
        </Box>
      </Popover>
    </>
  );
};

export default SearchPopover;
