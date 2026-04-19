import AttachmentMap from "@/shared/tabs/attachmentMap/AttachmentMap";
import { useAtomValue } from "jotai";
import { tblMaintLogAttachment } from "@/core/api/generated/api";
import { atomInitData } from "../FailureReportAtom";

const TabAttachments = () => {
  const { maintLog } = useAtomValue(atomInitData);
  const maintLogId = maintLog?.maintLogId;

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
