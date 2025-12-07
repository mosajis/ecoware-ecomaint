import DownloadIcon from "@mui/icons-material/Download";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import { ToolbarButton, useGridApiContext } from "@mui/x-data-grid";
import { useRef, useState } from "react";

export default function ExportButton() {
  const apiRef = useGridApiContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleExportCsv = () => {
    apiRef.current.exportDataAsCsv();
    setMenuOpen(false);
  };

  const handleExportPrint = () => {
    apiRef.current.exportDataAsPrint();
    setMenuOpen(false);
  };

  return (
    <>
      <Tooltip title="Export">
        <ToolbarButton
          ref={buttonRef}
          onClick={() => setMenuOpen(true)}
          size="small"
        >
          <DownloadIcon />
        </ToolbarButton>
      </Tooltip>
      <Menu
        anchorEl={buttonRef.current}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={handleExportCsv}>Export CSV</MenuItem>
        <MenuItem onClick={handleExportPrint}>Export Print/PDF</MenuItem>
      </Menu>
    </>
  );
}
