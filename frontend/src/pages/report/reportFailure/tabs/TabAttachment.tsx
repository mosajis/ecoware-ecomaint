import AttachmentMap from "@/shared/tabs/attachmentMap/AttachmentMap";
import { useAtomValue } from "jotai";
import { tblFailureReportAttachment } from "@/core/api/generated/api";
import { atomInitData } from "../FailureReportAtom";

const TabAttachments = () => {
  const { failureReport } = useAtomValue(atomInitData);
  const failureReportId = failureReport?.failureReportId;

  return (
    <AttachmentMap
      filterId={failureReportId}
      filterKey="failureReportId"
      relName="tblFailureReports"
      tableId="failureReportAttachmentId"
      label="Attachments"
      mapService={tblFailureReportAttachment}
    />
  );
};

export default TabAttachments;
