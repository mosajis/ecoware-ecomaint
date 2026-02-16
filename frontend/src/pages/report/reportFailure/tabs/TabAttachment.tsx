import AttachmentMap from "@/shared/tabs/attachmentMap/AttachmentMap";
import { useAtomValue } from "jotai";
import { tblFailureReportAttachment } from "@/core/api/generated/api";
import { failureReportAtom } from "../FailureReportAtom";

const TabAttachments = () => {
  const { maintLog } = useAtomValue(failureReportAtom);
  const maintLogId = maintLog?.maintLogId;

  return (
    <AttachmentMap
      filterId={maintLogId}
      filterKey="maintLogId"
      relName="tblMaintLog"
      tableId="failureReportAttachmentId"
      label="Failure Report Attachments"
      mapService={tblFailureReportAttachment}
    />
  );
};

export default TabAttachments;
