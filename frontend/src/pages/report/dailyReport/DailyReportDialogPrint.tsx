import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import PrintIcon from "@mui/icons-material/Print";
import DailyReportPrintTemplate from "./print/PrintTemplate";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import {
  tblMaintLog,
  TypeTblDailyReport,
  TypeTblMaintLog,
} from "@/core/api/generated/api";

type Props = {
  open: boolean;
  onClose: () => void;
  selectedRow: TypeTblDailyReport | null;
};

export default function DailyReportDialogPrint({
  open,
  onClose,
  selectedRow,
}: Props) {
  const contentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({ contentRef });

  const [loading, setLoading] = useState(false);
  const [maintLogs, setMaintLogs] = useState<TypeTblMaintLog[]>([]);

  const isReady = !!selectedRow;
  const date = selectedRow?.reportDate;

  useEffect(() => {
    if (!date) return;

    setLoading(true);

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    tblMaintLog
      .getAll({
        select: {
          tblMaintCause: true,
        },
        filter: {
          reportedDate: {
            gte: startOfDay.toISOString(),
            lte: endOfDay.toISOString(),
          },
        },
      })
      .then((res) => setMaintLogs(res.items))
      .finally(() => setLoading(false));
  }, [date, selectedRow]);

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
            ? `Please review before proceeding.`
            : "No records selected. Please select at least one row to print."}
        </Typography>

        <Button
          onClick={handlePrint}
          variant="contained"
          size="medium"
          startIcon={<PrintIcon />}
          loading={loading || !isReady}
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
        {isReady && (
          <DailyReportPrintTemplate
            dailyReport={selectedRow}
            maintLogs={maintLogs}
            ref={contentRef}
          />
        )}
      </Box>
    </FormDialog>
  );
}
