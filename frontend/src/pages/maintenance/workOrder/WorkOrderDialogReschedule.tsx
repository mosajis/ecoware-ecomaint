import Box from "@mui/material/Box";
import FieldDateTime from "@/shared/components/fields/FieldDateTime";
import FieldNumber from "@/shared/components/fields/FieldNumber";
import Editor from "@/shared/components/Editor";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import {
  tblCompJobCounter,
  tblWorkOrder,
  TypeTblWorkOrder,
} from "@/core/api/generated/api";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { atomUser } from "@/pages/auth/auth.atom";
import { workOrderReschedule } from "@/core/api/api";

const schema = z
  .object({
    currentDueDate: z.string().nullable(),
    newDueDate: z.string().min(1, "New due date is required"),
    newDueCount: z.number().nullable().optional(),
    currentDueCount: z.number().nullable().optional(),
    reason: z.string().min(1, "Reason must be at least 1 characters"),
  })
  .superRefine((data, ctx) => {
    if (
      data.currentDueDate &&
      data.newDueDate &&
      new Date(data.newDueDate) <= new Date(data.currentDueDate)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["newDueDate"],
        message: "New due date must be later than current due date",
      });
    }
  });

type FormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: (record: TypeTblWorkOrder) => void;
  workOrder: TypeTblWorkOrder | null;
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
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      currentDueDate: null,
      newDueDate: "",
      currentDueCount: null,
      newDueCount: null,
      reason: "",
    },
  });

  const [isCounterBased, setIsCounterBased] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(false);

  useEffect(() => {
    if (!workOrder) return;

    const init = async () => {
      try {
        setLoadingInitial(true);

        setValue("currentDueDate", workOrder.dueDate ?? null);

        const compJobId = workOrder.tblCompJob?.compJobId;
        if (!compJobId) return;

        const compJobCounters = await tblCompJobCounter.getAll({
          filter: { compJobId },
        });

        const compJobCounter = compJobCounters.items[0] ?? null;
        setIsCounterBased(!!compJobCounter);

        if (compJobCounter) {
          setValue("currentDueCount", compJobCounter.nextDueCount ?? null);
        }
      } finally {
        setLoadingInitial(false);
      }
    };

    init();
  }, [workOrder, setValue]);

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const onSubmit = async (data: FormValues) => {
    if (!workOrder) return;

    if (isCounterBased && data.newDueCount == null) {
      toast.error("New due count is required");
      return;
    }

    try {
      // یه endpoint همه کارها رو atomically انجام میده
      const result = await workOrderReschedule({
        workOrderId: workOrder.workOrderId,
        newDueDate: new Date(data.newDueDate).toISOString(),
        newDueCount: data.newDueCount ?? undefined,
        reason: data.reason,
      });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      onSuccess(result?.workOrder as any);
      handleClose();
    } catch {
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
      loadingInitial={loadingInitial || isSubmitting}
    >
      <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1.5} mb={2}>
        <Controller
          name="currentDueDate"
          control={control}
          render={({ field }) => (
            <FieldDateTime
              pickerProps={{ readOnly: true }}
              field={field}
              label="Current Due Date"
            />
          )}
        />

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

        <Controller
          name="currentDueCount"
          control={control}
          render={({ field }) => (
            <FieldNumber
              readOnly
              disabled={!isCounterBased}
              label="Current Due Count"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        <Controller
          name="newDueCount"
          control={control}
          render={({ field, fieldState }) => (
            <FieldNumber
              disabled={!isCounterBased}
              label="New Due Count"
              value={field.value}
              onChange={field.onChange}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
      </Box>

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
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />
    </FormDialog>
  );
}
