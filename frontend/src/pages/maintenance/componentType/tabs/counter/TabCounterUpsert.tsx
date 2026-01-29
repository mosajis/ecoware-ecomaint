import * as z from "zod";
import Box from "@mui/material/Box";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import NumberField from "@/shared/components/fields/FieldNumber";
import FieldAsyncSelectGrid from "@/shared/components/fields/FieldAsyncSelectGrid";
import { buildRelation } from "@/core/helper";
import { memo, useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  tblCompTypeCounter,
  tblCounterType,
  TypeTblCompTypeCounter,
} from "@/core/api/generated/api";

/* === Schema === */
const schema = z.object({
  counterType: z.object({
    counterTypeId: z.number(),
    name: z.string().optional().nullable(),
  }),

  orderNo: z.number().nullable(),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  mode: "create" | "update";
  recordId?: number | null;
  compTypeId: number;
  onClose: () => void;
  onSuccess: (data: TypeTblCompTypeCounter) => void;
};

function CounterUpsert({
  open,
  mode,
  recordId,
  compTypeId,
  onClose,
  onSuccess,
}: Props) {
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const defaultValues: FormValues = {
    counterType: null as any,
    orderNo: null,
  };

  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // === Load in edit ===
  const fetchData = useCallback(async () => {
    if (mode !== "update" || !recordId) {
      reset(defaultValues);
      return;
    }

    setLoadingInitial(true);
    try {
      const res = await tblCompTypeCounter.getById(recordId, {
        include: { tblCounterType: true },
      });

      reset({
        counterType: { ...res.tblCounterType },

        orderNo: res.orderNo ?? null,
      });
    } finally {
      setLoadingInitial(false);
    }
  }, [mode, recordId, reset]);

  useEffect(() => {
    if (open) fetchData();
  }, [open, fetchData]);

  // === Submit ===
  const onSubmit = useCallback(
    async (values: FormValues) => {
      const parsed = schema.safeParse(values);
      if (!parsed.success) return;

      try {
        setSubmitting(true);

        const counterTypeRelation = buildRelation(
          "tblCounterType",
          "counterTypeId",
          parsed.data.counterType.counterTypeId,
        );

        const compTypeRelation = buildRelation(
          "tblCompType",
          "compTypeId",
          compTypeId,
        );

        const payload = {
          orderNo: parsed.data.orderNo,
          ...counterTypeRelation,
          ...compTypeRelation,
        };

        let result: TypeTblCompTypeCounter;

        if (mode === "create") {
          result = await tblCompTypeCounter.create(payload);
        } else {
          result = await tblCompTypeCounter.update(recordId!, payload);
        }

        onSuccess(result);
        onClose();
      } finally {
        setSubmitting(false);
      }
    },
    [mode, recordId, compTypeId, onSuccess, onClose],
  );

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title={mode === "create" ? "Create Counter" : "Edit Counter"}
      loadingInitial={loadingInitial}
      submitting={submitting}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Box display="grid" gap={1.5}>
        {/* Counter Type */}
        <Controller
          name="counterType"
          control={control}
          render={({ field, fieldState }) => (
            <FieldAsyncSelectGrid
              label="Counter Type *"
              value={field.value}
              onChange={field.onChange}
              request={() => tblCounterType.getAll({ filter: { type: 0 } })}
              columns={[{ field: "name", headerName: "Name", flex: 1 }]}
              getRowId={(row) => row.counterTypeId}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />

        {/* Order */}
        <Controller
          name="orderNo"
          control={control}
          render={({ field }) => (
            <NumberField {...field} label="Order No" size="small" />
          )}
        />
      </Box>
    </FormDialog>
  );
}

export default memo(CounterUpsert);
