import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import PrintIcon from "@mui/icons-material/Print";
import DailyReportPrintTemplate from "./print/PrintTemplate";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import {
  tblMaintLog,
  tblMaintLogSpare,
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
  const [withRoutine, setWithRoutine] = useState(false);

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
        includeSpares: true,
        select: {
          tblMaintCause: true,
          tblMaintLogSpare: true,
        },
        filter: {
          instId: 300,
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
        <FormControlLabel
          control={
            <Checkbox
              checked={withRoutine}
              onChange={(e) => setWithRoutine(e.target.checked)}
            />
          }
          label="Include Routine Jobs"
        />

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
            withRoutine={withRoutine}
            ref={contentRef}
          />
        )}
      </Box>
    </FormDialog>
  );
}
