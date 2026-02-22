import AttachmentMap from "@/shared/tabs/attachmentMap/AttachmentMap";
import Alert from "@mui/material/Alert";
import { useAtomValue } from "jotai";
import { tblMaintLogAttachment } from "@/core/api/generated/api";
import { reportWorkAtom } from "../ReportWorkAtom";

interface StepAttachmentsProps {
  onDialogSuccess?: () => void;
}

const StepAttachments = () => {
  const { maintLog } = useAtomValue(reportWorkAtom);
  const maintLogId = maintLog?.maintLogId;

  const handleNext = (goNext: () => void) => {
    goNext();
  };

  return (
    <AttachmentMap
      filterId={maintLogId}
      filterKey="maintLogId"
      relName="tblMaintLog"
      tableId="maintLogAttachmentId"
      label="Maintenance Log Attachments"
      mapService={tblMaintLogAttachment}
    />
  );
};

export default StepAttachments;
