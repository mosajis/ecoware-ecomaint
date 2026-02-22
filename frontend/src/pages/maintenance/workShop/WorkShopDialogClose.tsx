import FormDialog from "@/shared/components/formDialog/FormDialog";
import FieldDateTime from "@/shared/components/fields/FieldDateTime";
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { tblWorkShop } from "@/core/api/generated/api";
import { buildRelation } from "@/core/helper";
import { useAtomValue } from "jotai";
import { atomUser } from "@/pages/auth/auth.atom";

type Props = {
  open: boolean;
  workShopId: number | null;
  onClose: () => void;
  onSuccess: () => void;
};

export default function WorkShopDialogComplete({
  open,
  workShopId,
  onClose,
  onSuccess,
}: Props) {
  const [closedDate, setClosedDate] = useState<Date | null>(new Date());
  const [loading, setLoading] = useState(false);

  const user = useAtomValue(atomUser);

  useEffect(() => {
    if (!open) {
      setClosedDate(new Date());
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workShopId) return;

    setLoading(true);
    try {
      await tblWorkShop.update(workShopId, {
        closedDate: closedDate?.toString(),
        ...buildRelation(
          "tblUsersTblWorkShopClosedByIdTotblUsers",
          "userId",
          user?.userId,
        ),
      });

      onSuccess();
      toast.success("WorkShop completed");
      onClose();
    } catch (error: any) {
      toast.error(error?.message || "Failed to complete");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormDialog
      open={open}
      title="Complete WorkShop"
      submitText="Ok"
      cancelText="Cancel"
      onClose={onClose}
      onSubmit={handleSubmit}
      loadingInitial={loading}
    >
      <Box display="flex" flexDirection="column" gap={1.5} pt={1}>
        <FieldDateTime
          type="DATE"
          label="Closed Date"
          disabled={loading}
          field={{
            value: closedDate,
            onChange: (v: Date) => setClosedDate(v),
          }}
        />
      </Box>
    </FormDialog>
  );
}
