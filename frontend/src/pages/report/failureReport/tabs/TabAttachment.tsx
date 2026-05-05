import AttachmentMap from "@/shared/tabs/attachmentMap/AttachmentMap";
import {
  tblMaintLogAttachment,
  TypeTblFailureReport,
} from "@/core/api/generated/api";

type Props = {
  failreReport?: TypeTblFailureReport;
};

const TabAttachments = ({ failreReport }: Props) => {
  const maintLogId = failreReport?.maintLogId;

  return (
    <AttachmentMap
      filterId={maintLogId}
      filterKey="maintLogId"
      relName="tblMaintLog"
      tableId="maintLogAttachmentId"
      label="Attachments"
      mapService={tblMaintLogAttachment}
    />
  );
};

export default TabAttachments;
