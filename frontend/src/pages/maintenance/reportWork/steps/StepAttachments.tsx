import ReportWorkStep from "../ReportWorkStep";
import AttachmentMap from "@/shared/tabs/attachmentMap/AttachmentMap";
import Alert from "@mui/material/Alert";
import { useAtomValue } from "jotai";
import { atomInitalData } from "../ReportWorkAtom";
import { tblMaintLogAttachment } from "@/core/api/generated/api";

interface StepAttachmentsProps {
  onDialogSuccess?: () => void;
}

const StepAttachments = ({ onDialogSuccess }: StepAttachmentsProps) => {
  const { maintLog } = useAtomValue(atomInitalData);
  const maintLogId = maintLog?.maintLogId;

  const handleNext = (goNext: () => void) => {
    goNext();
  };

  return (
    <ReportWorkStep onNext={handleNext} onDialogSuccess={onDialogSuccess}>
      {!maintLogId ? (
        <Alert severity="warning">
          Please save the General information first before adding attachments.
        </Alert>
      ) : (
        <AttachmentMap
          filterId={maintLogId}
          filterKey="maintLogId"
          relName="tblMaintLog"
          tableId="maintLogAttachmentId"
          label="Maintenance Log Attachments"
          mapService={tblMaintLogAttachment}
        />
      )}
    </ReportWorkStep>
  );
};

export default StepAttachments;
