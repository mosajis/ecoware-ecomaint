import ConfirmDialog from "@/shared/components/ConfirmDialog";
import { workOrderPostpone } from "@/core/api/api";
import { TypeTblWorkOrder } from "@/core/api/generated/api";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onClose: () => void;
  workOrders: TypeTblWorkOrder[];
  onSuccess: (workOrders: TypeTblWorkOrder[]) => void;
};

export default function WorkOrderDialogPostpone({
  open,
  onClose,
  workOrders,
  onSuccess,
}: Props) {
  const handleConfirm = async () => {
    try {
      const result = await workOrderPostpone({
        workOrderIds: workOrders.map((wo) => wo.workOrderId),
      });
      onSuccess(result.workOrders as any);
      onClose();
    } catch {
      toast.error("Failed to postpone work orders");
    }
  };

  return (
    <ConfirmDialog
      open={open}
      title="Postpone Work Order(s)"
      message={`Are you sure you want to postpone ${workOrders.length} work order(s)?`}
      confirmText="Postpone"
      cancelText="Cancel"
      onConfirm={handleConfirm}
      onCancel={onClose}
    />
  );
}
