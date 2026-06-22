import ConfirmDialog from "@/shared/components/ConfirmDialog";
import { workOrderCancel } from "@/core/api/api";
import { TypeTblWorkOrder } from "@/core/api/generated/api";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onClose: () => void;
  workOrders: TypeTblWorkOrder[];
  onSuccess: (workOrders: TypeTblWorkOrder[]) => void;
};

export default function WorkOrderDialogCancel({
  open,
  onClose,
  workOrders,
  onSuccess,
}: Props) {
  const handleConfirm = async () => {
    try {
      const result = await workOrderCancel({
        workOrderIds: workOrders.map((wo) => wo.workOrderId),
      });
      onSuccess(result.workOrders as any);
      onClose();
    } catch {
      toast.error("Failed to cancel work orders");
    }
  };

  return (
    <ConfirmDialog
      open={open}
      title="Cancel Work Orders"
      message={`Are you sure you want to cancel ${workOrders.length} work order(s)?`}
      confirmText="Cancel WorkOrder"
      cancelText="Close"
      confirmColor="error"
      onConfirm={handleConfirm}
      onCancel={onClose}
    />
  );
}
