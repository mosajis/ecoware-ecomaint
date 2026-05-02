import ConfirmDialog from "@/shared/components/ConfirmDialog";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { tblFailureReports } from "@/core/api/generated/api";
import { buildRelation } from "@/core/helper";
import { toast } from "sonner";

type Props = {
  open: boolean;
  failureReportId: number | null;
  onClose: () => void;
  onSuccess: (patch: any) => void;
};

export default function failureReportOpenDialog({
  open,
  failureReportId,
  onClose,
  onSuccess,
}: Props) {
  const handleConfirm = async () => {
    if (!failureReportId) return;

    try {
      const res = await tblFailureReports.update(
        failureReportId,
        {
          closedDateTime: null,
          ...buildRelation("tblUsers", "userId", undefined),
        },
        {
          include: {
            tblUsers: {
              include: {
                tblEmployeeTblUsersEmployeeIdTotblEmployee: true,
              },
            },
          },
        },
      );
      onSuccess(res);
      toast.success("Failure Report Open Successfully");
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
