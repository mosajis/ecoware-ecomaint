import * as React from "react";
import { ToolbarButton, useGridApiContext } from "@mui/x-data-grid";
import { Menu, MenuItem, Button, Tooltip } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

export default function ExportButton() {
  const apiRef = useGridApiContext();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

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
