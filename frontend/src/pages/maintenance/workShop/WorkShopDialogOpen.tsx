import ConfirmDialog from "@/shared/components/ConfirmDialog";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { tblFailureReports, tblWorkShop } from "@/core/api/generated/api";
import { buildRelation } from "@/core/helper";
import { toast } from "sonner";

type Props = {
  open: boolean;
  workShopId: number | null;
  onClose: () => void;
  onSuccess: (patch: any) => void;
};

export default function WorkShopDialogOpen({
  open,
  workShopId,
  onClose,
  onSuccess,
}: Props) {
  const handleConfirm = async () => {
    if (!workShopId) return;

    const patch = {
      closedDate: null,
      ...buildRelation("tblEmployeeTblWorkShopClosedByIdTotblEmployee", "employeeId", undefined),
    };

    try {
      await tblWorkShop.update(workShopId, {
        ...patch,
      });

      onSuccess(patch);

      toast.success("WorkShop Open Successfully");

      onClose();
    } catch (error: any) {
      toast.error(error?.message || "Failed to reopen");
    }
  };

  return (
    <ConfirmDialog
      open={open}
      confirmColor="primary"
      icon={<LockOpenIcon color="inherit" fontSize="large" />}
      title="Open Failure Report"
      message="Are you sure you want to reopen this failure report?"
      confirmText="Open"
      cancelText="Cancel"
      onConfirm={handleConfirm}
      onCancel={onClose}
    />
  );
}
