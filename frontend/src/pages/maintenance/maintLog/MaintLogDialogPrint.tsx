import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import PrintIcon from "@mui/icons-material/Print";
import MaintLogPrintTemplate from "./print/PrintTemplate";
import { useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { TypeTblMaintLog } from "@/core/api/generated/api";

type Props = {
  open: boolean;
  onClose: () => void;
  rows: TypeTblMaintLog[];
};

export default function MaintLogDialogPrint({ open, onClose, rows }: Props) {
  const contentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({ contentRef });

  const isReady = rows.length > 0;

  return (
    <FormDialog
      open={open}
      title="Print Maintenance Log"
      onClose={onClose}
      hideFooter
      maxWidth="xs"
    >
      <Box display="flex" flexDirection="column" gap={2} p={1}>
        <Typography variant="body1" color="text.secondary">
          {isReady
            ? `${rows.length} record${rows.length > 1 ? "s" : ""} selected for printing. Please review before proceeding.`
            : "No records selected. Please select at least one row to print."}
        </Typography>

        <Button
          onClick={handlePrint}
          variant="contained"
          size="medium"
          startIcon={<PrintIcon />}
          disabled={!isReady}
          sx={{
            alignSelf: "center",
            py: 1.5,
            px: 4,
            fontWeight: 600,
            fontSize: "1rem",
            width: "100%",
          }}
        >
          Print Report
        </Button>
      </Box>

      {/* Hidden printable content */}
      <Box display="none">
        {isReady && <MaintLogPrintTemplate ref={contentRef} rows={rows} />}
      </Box>
    </FormDialog>
  );
}
