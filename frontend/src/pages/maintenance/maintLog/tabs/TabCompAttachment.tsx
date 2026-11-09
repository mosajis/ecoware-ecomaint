import AttachmentMap from "@/shared/tabs/attachmentMap/AttachmentMap";
import { memo } from "react";
import {
  tblComponentUnitAttachment,
  tblMaintLogAttachment,
  TypeTblComponentUnit,
  TypeTblMaintLog,
} from "@/core/api/generated/api";

interface Props {
  selected?: TypeTblMaintLog | null;
  label?: string;
}

export function TabComponentUnitAttachment({ selected, label }: Props) {
  return (
    <AttachmentMap
      filterId={selected?.tblComponentUnit?.compId}
      filterKey="compId"
      relName="tblComponentUnit"
      tableId="componentUnitAttachmentId"
      label={label}
      mapService={tblComponentUnitAttachment}
    />
  );
}

export default memo(TabComponentUnitAttachment);
