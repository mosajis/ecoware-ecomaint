import AttachmentMap from "@/shared/tabs/attachmentMap/AttachmentMap";
import { useAtomValue } from "jotai";
import { tblWorkShopAttachment } from "@/core/api/generated/api";
import { atomInitData } from "../WorkShopAtom";

const TabAttachments = () => {
  const { workShop } = useAtomValue(atomInitData);
  const workShopId = workShop?.workShopId;

  return (
    <AttachmentMap
      filterId={workShopId}
      filterKey="workShopId"
      relName="tblWorkShop"
      tableId="workShopAttachmentId"
      label="Attachments"
      mapService={tblWorkShopAttachment}
    />
  );
};

export default TabAttachments;
