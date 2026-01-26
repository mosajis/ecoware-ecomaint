import AttachmentMap from "@/shared/tabs/attachmentMap/AttachmentMap";
import { memo } from "react";
import { tblJobDescriptionAttachment } from "@/core/api/generated/api";

interface Props {
  jobDescriptionId?: number | null;
}

export function TabAttachment({ jobDescriptionId }: Props) {
  return (
    <AttachmentMap
      filterId={jobDescriptionId}
      filterKey="jobDescId"
      relName="tblJobDescription"
      tableId="jobDescriptionAttachmentId"
      label="Attachments"
      mapService={tblJobDescriptionAttachment}
    />
  );
}

export default memo(TabAttachment);
