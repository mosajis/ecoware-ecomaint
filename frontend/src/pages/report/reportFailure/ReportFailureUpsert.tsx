import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import FailureReportTabs from "./FailureReportTabs";
import DialogHeader from "@/shared/components/dialog/DialogHeader";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import { memo, useEffect } from "react";
import { useAtom } from "jotai";
import { tblFailureReports, tblMaintLog } from "@/core/api/generated/api";
import { atomInitData, Type } from "./FailureReportAtom";

type Props = {
  open: boolean;
  mode: "create" | "update";
  failureReportId?: number | null;
  compId?: number;
  onClose: () => void;
  onSuccess: (initData: Type) => void;
};

function FailureReportUpsert({
  open,
  failureReportId,
  compId,
  onClose,
  onSuccess,
}: Props) {
  const [initData, setInitData] = useAtom(atomInitData);

  const mode = failureReportId ? "update" : "create";

  // Reset atom when dialog closes
  useEffect(() => {
    if (!open) {
      setInitData({
        maintLog: null,
        failureReport: null,
      });
    }
  }, [open, setInitData]);

  // 🔥 Fetch here instead of StepGeneral
  useEffect(() => {
    if (!open) return;

    const fetchData = async () => {
      if (mode !== "update" || !failureReportId) {
        return;
      }

      try {
        const failureReport = await tblFailureReports.getById(failureReportId, {
          include: {
            tblMaintLog: {
              include: {
                tblComponentUnit: true,
                tblMaintType: true,
                tblMaintCause: true,
                tblMaintClass: true,
              },
            },
            tblFailureSeverityLevel: true,
            tblFailureStatus: true,
            tblFailureGroupFollow: true,
            tblLocation: true,
          },
        });

        let maintLog = null;
        if (failureReport.maintLogId) {
          maintLog = await tblMaintLog.getById(failureReport.maintLogId, {
            include: {
              tblMaintClass: true,
              tblMaintCause: true,
              tblMaintType: true,
            },
          });
        }

        setInitData({
          maintLog,
          failureReport,
        });
      } finally {
      }
    };

    fetchData();
  }, [open, mode, failureReportId, setInitData]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogHeader
        title={
          mode === "create" ? "Create Failure Report" : "Edit Failure Report"
        }
        onClose={onClose}
      />

      <DialogContent
        dividers
        style={{
          height: 700,
          padding: "4px",
          background: "var(--template-palette-background-default)",
        }}
      >
        {initData && (
          <FailureReportTabs
            mode={mode}
            compId={compId}
            failureReportId={failureReportId}
          />
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center" }}>
        <Button variant="outlined" onClick={onClose} sx={{ width: 200 }}>
          Close
        </Button>

        <Button
          onClick={() => onSuccess(initData)}
          sx={{ width: 200 }}
          variant={initData?.maintLog?.maintLogId ? "contained" : "outlined"}
          disabled={!initData?.maintLog?.maintLogId}
        >
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default memo(FailureReportUpsert);
