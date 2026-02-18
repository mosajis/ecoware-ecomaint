import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import PrintIcon from "@mui/icons-material/Print";
import PrintTemplate from "./print/PrintTemplate";
import { useState, useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import {
  tblFailureReports,
  TypeTblFailureReports,
} from "@/core/api/generated/api";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onClose: () => void;
  failureReportId: number;
};

export default function ReportFailureDialogPrint({
  open,
  onClose,
  failureReportId,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [failureReport, setFailureReport] =
    useState<TypeTblFailureReports | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({ contentRef });

  useEffect(() => {
    if (open && failureReportId) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const res = await tblFailureReports.getById(failureReportId, {
            include: {
              tblMaintLog: {
                include: {
                  tblUsersTblMaintLogReportedByTotblUsers: true,
                  tblComponentUnit: true,
                  tblMaintCause: true,
                  tblDiscipline: true,
                },
              },
              tblFailureSeverityLevel: true,
              tblFailureStatus: true,
              tblFailureGroupFollow: true,
              tblUsers: true,
              tblLocation: true,
            },
          });
          setFailureReport(res);
        } catch (error) {
          toast.error("Failed to fetch Report Data");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [failureReportId, open]);

  return (
    <FormDialog
      open={open}
      title="Print Failure Report"
      onClose={onClose}
      loadingInitial={loading}
      hideFooter
      maxWidth="xs"
    >
      <Box display="flex" flexDirection="column" gap={2} p={1}>
        <Typography variant="body1" color="text.secondary" mb={2}>
          You are about to print the failure report. Please make sure all
          information is correct before printing.
        </Typography>

        <Button
          onClick={handlePrint}
          variant="contained"
          size="medium"
          startIcon={<PrintIcon />}
          sx={{
            alignSelf: "center",
            py: 1.5,
            px: 4,
            fontWeight: 600,
            fontSize: "1rem",
            width: "100%",
          }}
          disabled={!failureReport}
        >
          Print Report
        </Button>
      </Box>

      {/* Hidden printable content */}
      <Box display="none">
        {failureReport?.failureReportId && (
          <PrintTemplate ref={contentRef} failureReport={failureReport} />
        )}
      </Box>
    </FormDialog>
  );
}
