import Box from "@mui/material/Box";
import FieldAsyncSelectGrid from "@/shared/components/fields/FieldAsyncSelectGrid";
import Editor from "@/shared/components/Editor";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import { tblPendingType, tblWorkOrder } from "@/core/api/generated/api";
import { TypeTblWorkOrderWithRels } from "./types";
import { GridRowId } from "@mui/x-data-grid";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const schema = z.object({
  pendingType: z.object({
    pendTypeId: z.number(),
    pendTypeName: z.string(),
  }),
  note: z.string().optional(),
});

export type formValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: (record: TypeTblWorkOrderWithRels) => void;
  workOrder: TypeTblWorkOrderWithRels | null;
};

const pendingTypeColumns = [
  { field: "pendTypeName", headerName: "Pending Type", flex: 1 },
];

export default function WorkOrderPendingDialog({
  open,
  onClose,
  onSuccess,
  workOrder,
}: Props) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<formValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      pendingType: undefined,
      note: "",
    },
  });

  const onSubmit = async (data: formValues) => {
    if (!workOrder) return;

    try {
      const result = await tblWorkOrder.update(
        workOrder.workOrderId,
        {
          tblPendingType: {
            connect: {
              pendTypeId: data.pendingType.pendTypeId,
            },
          },
          tblWorkOrderStatus: {
            connect: {
              workOrderStatusId: 4,
            },
          },
          pendingdate: new Date().toString(),
          lastupdate: new Date().toString(),
          userComment: data.note || undefined,
        },
        {
          include: {
            tblPendingType: true,
            tblWorkOrderStatus: true,
          },
        },
      );

      onSuccess(result);
      handleClose();
    } catch {
      toast.error("Failed to update work order");
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <FormDialog
      open={open}
      onClose={handleClose}
      title="Pending Work Order"
      onSubmit={handleSubmit(onSubmit)}
      loadingInitial={isSubmitting}
    >
      <Box height={500}>
        <Controller
          name="pendingType"
          control={control}
          render={({ field, fieldState }) => (
            <FieldAsyncSelectGrid
              label="Pending Type *"
              placeholder="pending type"
              columns={pendingTypeColumns}
              request={tblPendingType.getAll}
              getRowId={(row) => row.pendTypeId as GridRowId}
              getOptionLabel={(item) => item?.pendTypeName}
              value={field.value}
              onChange={field.onChange}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name="note"
          control={control}
          render={({ field }) => (
            <Editor
              label="Note"
              placeholder="Enter note ..."
              initValue={field.value}
              onChange={field.onChange}
              containerStyle={{ marginTop: 16 }}
            />
          )}
        />
      </Box>
    </FormDialog>
  );
}
