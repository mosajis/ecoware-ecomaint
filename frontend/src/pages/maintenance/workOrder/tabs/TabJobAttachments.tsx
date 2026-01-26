import AttachmentMap from "@/shared/tabs/attachmentMap/AttachmentMap";
import { memo } from "react";
import {
  tblJobDescriptionAttachment,
  TypeTblWorkOrder,
} from "@/core/api/generated/api";

interface Props {
  workOrder?: TypeTblWorkOrder;
  label?: string;
}

export function TabAttachment({ workOrder }: Props) {
  return (
    <AttachmentMap
      disableAdd
      disableDelete
      filterId={workOrder?.tblCompJob?.jobDescId}
      filterKey="jobDescId"
      relName="tblJobDescription"
      tableId="jobDescriptionAttachmentId"
      label="Attachments"
      mapService={tblJobDescriptionAttachment}
    />
  );
}

export default memo(TabAttachment);
