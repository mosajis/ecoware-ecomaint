import AttachmentMap from "@/shared/tabs/attachmentMap/AttachmentMap";
import { useAtomValue } from "jotai";
import { tblWorkShopAttachment } from "@/core/api/generated/api";

type Props = {
  workShopId: number;
};

const TabAttachments = (props: Props) => {
  const { workShopId } = props;

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
