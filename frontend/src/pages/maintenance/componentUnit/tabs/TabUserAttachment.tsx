import AttachmentMap from "@/shared/tabs/attachmentMap/AttachmentMap";
import { memo } from "react";
import {
  tblComponentUnitAttachment,
  TypeTblComponentUnit,
} from "@/core/api/generated/api";

interface Props {
  componentUnit?: TypeTblComponentUnit | null;
  label?: string;
}

export function TabComponentUnitAttachment({ componentUnit, label }: Props) {
  return (
    <AttachmentMap
      filterId={componentUnit?.compId}
      filterKey="compId"
      relName="tblComponentUnit"
      tableId="componentUnitAttachmentId"
      label={label}
      mapService={tblComponentUnitAttachment}
    />
  );
}

export default memo(TabComponentUnitAttachment);
