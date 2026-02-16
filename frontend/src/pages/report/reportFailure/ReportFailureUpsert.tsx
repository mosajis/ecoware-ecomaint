import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { memo, useEffect } from "react";
import { useSetAtom } from "jotai";
import { failureReportAtom } from "./FailureReportAtom";
import FailureReportTabs from "./FailureReportTabs";

type Props = {
  open: boolean;
  mode: "create" | "update";
  failureReportId?: number | null;
  compId?: number;
  onClose: () => void;
  onSuccess: () => void;
};

function FailureReportUpsert({
  open,
  mode,
  failureReportId,
  compId,
  onClose,
  onSuccess,
}: Props) {
  const setFailureReportAtom = useSetAtom(failureReportAtom);

  // Reset atom when dialog closes
  useEffect(() => {
    if (!open) {
      setFailureReportAtom({
        maintLog: null,
        failureReport: null,
      });
    }
  }, [open, setFailureReportAtom]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        {mode === "create" ? "Create Failure Report" : "Update Failure Report"}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <FailureReportTabs
          mode={mode}
          failureReportId={failureReportId}
          compId={compId}
        />
      </DialogContent>
    </Dialog>
  );
}

export default memo(FailureReportUpsert);
