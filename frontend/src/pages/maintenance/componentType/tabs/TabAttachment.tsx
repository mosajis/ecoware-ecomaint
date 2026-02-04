import AttachmentMap from "@/shared/tabs/attachmentMap/AttachmentMap";
import ConfirmDialog from "@/shared/components/ConfirmDialog";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import { memo, useState } from "react";
import {
  tblCompTypeAttachment,
  TypeTblCompType,
} from "@/core/api/generated/api";
import { logicTblCompTypeAttachment } from "@/core/api/api";
import { toast } from "sonner";

type Props = {
  compType?: TypeTblCompType | null;
  label?: string;
};

export function TabCompTypeAttachment({ compType, label }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [effectId, setEffectId] = useState<number | null>(null);
  const [effectOperation, setEffectOperation] = useState<0 | 2 | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [pendingDeleteFn, setPendingDeleteFn] = useState<
    (() => Promise<void>) | null
  >(null);

  const resetConfirmState = () => {
    setConfirmOpen(false);
    setEffectId(null);
    setEffectOperation(null);
    setPendingDeleteFn(null);
  };

  const handleConfirmYes = async () => {
    try {
      if (effectId !== null && effectOperation !== null) {
        await logicTblCompTypeAttachment.effect(effectId, effectOperation);
      }

      // اگر delete بود، حالا باید پاک کنیم
      if (effectOperation === 2 && pendingDeleteFn) {
        await pendingDeleteFn();
      }

      toast.success("Changes applied successfully");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to apply effect");
    } finally {
      resetConfirmState();
      setRefreshTrigger((prev) => prev + 1);
    }
  };

  const handleConfirmNo = async () => {
    // اگر delete بود، بدون effect پاک کنیم
    if (effectOperation === 2 && pendingDeleteFn) {
      await pendingDeleteFn();
    }

    resetConfirmState();
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleAfterAdd = (compTypeAttachmentId: number) => {
    setEffectId(compTypeAttachmentId);
    setEffectOperation(0);
    setConfirmOpen(true);
  };

  const handleAskDelete = (
    compTypeAttachmentId: number,
    deleteFn: () => Promise<void>,
  ) => {
    setEffectId(compTypeAttachmentId);
    setEffectOperation(2);
    setPendingDeleteFn(() => deleteFn); // ذخیره تابع delete
    setConfirmOpen(true);
  };

  return (
    <>
      <AttachmentMap
        filterId={compType?.compTypeId}
        filterKey="compTypeId"
        relName="tblCompType"
        tableId="compTypeAttachmentId"
        label={label || "Attachments"}
        mapService={tblCompTypeAttachment}
        refreshTrigger={refreshTrigger}
        onAfterAdd={handleAfterAdd}
        onAskDelete={handleAskDelete}
      />

      <ConfirmDialog
        open={confirmOpen}
        icon={<PublishedWithChangesIcon sx={{ fontSize: "3rem" }} />}
        title="Apply Changes"
        message="Apply changes to related components?"
        confirmText="Yes"
        cancelText="No"
        confirmColor="primary"
        onConfirm={handleConfirmYes}
        onCancel={handleConfirmNo}
      />
    </>
  );
}

export default memo(TabCompTypeAttachment);
