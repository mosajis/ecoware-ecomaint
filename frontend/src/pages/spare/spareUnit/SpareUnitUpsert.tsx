import * as z from "zod";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import Box from "@mui/material/Box";
import { memo, useEffect, useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AsyncSelectField } from "@/shared/components/AsyncSelectField";
import { buildRelation } from "@/core/helper";
import {
  tblSpareType,
  tblSpareUnit,
  TypeTblSpareUnit,
} from "@/core/api/generated/api";

// === Validation Schema ===
const schema = z.object({
  stockTypeId: z
    .object({
      stockTypeId: z.number(),
      name: z.string().nullable().optional(),
      no: z.string().nullable().optional(),
    })
    .nullable(),
});

export type StockItemFormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  mode: "create" | "update";
  recordId?: number | null;
  onClose: () => void;
  onSuccess: (data: TypeTblSpareUnit) => void;
};

function StockItemFormDialog({
  open,
  mode,
  recordId,
  onClose,
  onSuccess,
}: Props) {
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const defaultValues: StockItemFormValues = {
    stockTypeId: null,
  };

  const { control, handleSubmit, reset } = useForm<StockItemFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // === Load record in edit mode ===
  const fetchData = useCallback(async () => {
    if (mode !== "update" || !recordId) {
      reset(defaultValues);
      return;
    }

    setLoadingInitial(true);

    try {
      const res = await tblSpareUnit.getById(recordId, {
        include: { tblSpareType: true },
      });

      reset({
        stockTypeId: res?.tblSpareType ?? null,
      });
    } finally {
      setLoadingInitial(false);
    }
  }, [mode, recordId, reset]);

  useEffect(() => {
    if (open) fetchData();
  }, [open, fetchData]);

  const isDisabled = loadingInitial || submitting;

  // === Submit Handler ===
  const handleFormSubmit = useCallback(
    async (values: StockItemFormValues) => {
      const parsed = schema.safeParse(values);
      if (!parsed.success) return;

      try {
        setSubmitting(true);

        let result: TypeTblSpareUnit;

        const stockTypeId = parsed.data.stockTypeId?.stockTypeId ?? null;

        const stockTypeRelation = buildRelation(
          "tblSpareType",
          "spareTypeId",
          stockTypeId,
        );

        if (mode === "create") {
          // POST Request
          result = await tblSpareUnit.create({
            ...stockTypeRelation,
          });
        } else {
          // PUT Request
          result = await tblSpareUnit.update(recordId!, {
            ...stockTypeRelation,
          });
        }

        onSuccess(result);
        onClose();
      } finally {
        setSubmitting(false);
      }
    },
    [mode, recordId, onSuccess, onClose],
  );

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title={mode === "create" ? "Create Stock Item" : "Edit Stock Item"}
      submitting={submitting}
      loadingInitial={loadingInitial}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <Box display="grid" gridTemplateColumns="repeat(1, 1fr)" gap={1.5}>
        {/* Stock Type Select */}
        <Controller
          name="stockTypeId"
          control={control}
          render={({ field, fieldState }) => (
            <AsyncSelectField
              dialogMaxWidth="sm"
              label="Stock Type"
              selectionMode="single"
              value={field.value}
              request={tblSpareType.getAll}
              columns={[{ field: "name", headerName: "Name", flex: 1 }]}
              getRowId={(row) => row.stockTypeId}
              onChange={field.onChange}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              disabled={isDisabled}
            />
          )}
        />
      </Box>
    </FormDialog>
  );
}

export default memo(StockItemFormDialog);
