import Box from "@mui/material/Box";
import FieldDateTime from "@/shared/components/fields/FieldDateTime";
import FieldNumber from "@/shared/components/fields/FieldNumber";
import Editor from "@/shared/components/Editor";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import {
  tblWorkOrder,
  tblCompJob,
  tblReScheduleLog,
} from "@/core/api/generated/api";
import { TypeTblWorkOrderWithRels } from "./types";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { useAtomValue } from "jotai";
import { atomUser } from "@/pages/auth/auth.atom";
import { buildRelation } from "@/core/helper";

export const schema = z.object({
  currentDueDate: z.string().nullable(),
  newDueDate: z.string().nullable(),
  currentDueCount: z.number().nullable(),
  newDueCount: z.number().nullable(),
  reason: z.string().nullable(),
});

export type formValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: (record: TypeTblWorkOrderWithRels) => void;
  workOrder: TypeTblWorkOrderWithRels | null;
};

export default function WorkOrderDialogReschedule({
  open,
  onClose,
  onSuccess,
  workOrder,
}: Props) {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = useForm<formValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      currentDueDate: undefined,
      newDueDate: undefined,
      currentDueCount: undefined,
      newDueCount: undefined,
      reason: "",
    },
  });

  const user = useAtomValue(atomUser);
  const userId = user?.userId as number;

  // // Set current values when workOrder changes
  // useEffect(() => {
  //   if (workOrder) {
  //     setValue("currentDueDate", workOrder.dueDate ? workOrder.dueDate : null);
  //     setValue(
  //       "currentDueCount",
  //       workOrder.tblCompJob?.
  //         ? new Date().getTime()
  //         : null,
  //     );
  //   }
  // }, [workOrder, setValue]);

  const onSubmit = async (data: formValues) => {
    if (!workOrder) return;

    try {
      // 1. Update CompJob nextDueDate
      if (workOrder.compJobId && data.newDueDate) {
        await tblCompJob.update(workOrder.compJobId, {
          nextDueDate: data.newDueDate,
          lastupdate: new Date().toISOString(),
        });
      }

      // 2. Update WorkOrder dueDate
      const updatedWorkOrder = await tblWorkOrder.update(
        workOrder.workOrderId,
        {
          tblWorkOrderStatus: {
            connect: {
              workOrderStatusId: 2,
            },
          },
          issuedDate: null,
          ...buildRelation(
            "tblUsersTblWorkOrderIssuedByTotblUsers",
            "issuedBy",
            null,
          ),
          dueDate: data.newDueDate,
          lastupdate: new Date().toISOString(),
        },
        {
          include: {
            tblComponentUnit: {
              include: {
                tblCompStatus: true,
                tblLocation: true,
              },
            },
            tblCompJob: {
              include: {
                tblJobDescription: true,
                tblPeriod: true,
              },
            },
            tblPendingType: true,
            tblDiscipline: true,
            tblWorkOrderStatus: true,
          },
        },
      );

      // 3. Create RescheduleLog
      await tblReScheduleLog.create({
        tblWorkOrder: {
          connect: {
            workOrderId: workOrder.workOrderId,
          },
        },
        fromDueDate: data.currentDueDate,
        toDueDate: data.newDueDate,
        rescheduledDate: new Date().toISOString(),
        reason: data.reason,
        lastupdate: new Date().toISOString(),
        rescheduledBy: userId,
      });

      onSuccess(updatedWorkOrder);
      handleClose();
    } catch (error) {
      console.error("Failed to reschedule work order:", error);
      toast.error("Failed to reschedule work order");
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
      title="Reschedule Work Order"
      onSubmit={handleSubmit(onSubmit)}
      loadingInitial={isSubmitting}
    >
      <Box display="grid" gridTemplateColumns={"1fr 1fr"} gap={1.5} mb={2}>
        {/* Current Due Date - ReadOnly */}
        <Controller
          name="currentDueDate"
          control={control}
          render={({ field }) => (
            <FieldDateTime field={field} label="Current Due Date" />
          )}
        />

        {/* New Due Date */}
        <Controller
          name="newDueDate"
          control={control}
          render={({ field, fieldState }) => (
            <FieldDateTime
              field={field}
              label="New Due Date *"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />

        {/* Current Due Count - ReadOnly */}
        <Controller
          name="currentDueCount"
          control={control}
          render={({ field }) => (
            <FieldNumber
              label="Current Due Count"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        {/* New Due Count */}
        <Controller
          name="newDueCount"
          control={control}
          render={({ field, fieldState }) => (
            <FieldNumber
              label="New Due Count"
              value={field.value}
              onChange={field.onChange}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
      </Box>
      {/* Reason */}
      <Controller
        name="reason"
        control={control}
        render={({ field, fieldState }) => (
          <Editor
            containerStyle={{ height: 250 }}
            label="Reason *"
            placeholder="Enter reason for rescheduling..."
            initValue={field.value}
            onChange={field.onChange}
          />
        )}
      />
    </FormDialog>
  );
}
