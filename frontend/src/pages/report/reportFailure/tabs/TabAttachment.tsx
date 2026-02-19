import AttachmentMap from "@/shared/tabs/attachmentMap/AttachmentMap";
import { useAtomValue } from "jotai";
import { tblMaintLogAttachment } from "@/core/api/generated/api";
import { atomInitData } from "../FailureReportAtom";

const TabAttachments = () => {
  const { failureReport } = useAtomValue(atomInitData);
  const failureReportId = failureReport?.failureReportId;

  return (
    <AttachmentMap
      filterId={failureReportId}
      filterKey="maintLogId"
      relName="tblMaintLog"
      tableId="maintLogAttachmentId"
      label="Attachments"
      mapService={tblMaintLogAttachment}
    />
  );
};

export default TabAttachments;
