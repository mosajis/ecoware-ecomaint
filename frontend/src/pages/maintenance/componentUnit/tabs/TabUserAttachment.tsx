import AttachmentMap from "@/shared/tabs/attachmentMap/AttachmentMap";
import { memo } from "react";
import {
  tblComponentUnitAttachment,
  tblMaintLogAttachment,
  TypeTblComponentUnit,
} from "@/core/api/generated/api";

interface Props {
  componentUnit?: TypeTblComponentUnit | null;
  label?: string;
}

export function TabComponentUnitAttachment({ componentUnit, label }: Props) {
  return (
    <AttachmentMap
      extraFilter={{ tblMaintLog: { compId: componentUnit?.compId } }}
      filterId={undefined}
      filterKey="maintLogId"
      relName="tblMaintLog"
      tableId="maintLogAttachmentId"
      label={label}
      mapService={tblMaintLogAttachment}
    />
  );
}

export default memo(TabComponentUnitAttachment);
