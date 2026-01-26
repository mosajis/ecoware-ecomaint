import * as z from "zod";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import NumberField from "@/shared/components/NumberField";
import { memo, useEffect, useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tblSpareType, TypeTblSpareType } from "@/core/api/generated/api";
import { AsyncSelectField } from "@/shared/components/AsyncSelectField";
import { buildRelation } from "@/core/helper";

// === Validation Schema ===
const schema = z.object({
  name: z.string().min(1, "Name is required"),
  no: z.string().nullable().optional(),
  parentStockTypeId: z
    .object({
      stockTypeId: z.number(),
      name: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
  orderNo: z.number().nullable(),
});

export type StockTypeFormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  mode: "create" | "update";
  recordId?: number | null;
  onClose: () => void;
  onSuccess: () => void;
};

function StockTypeFormDialog({
  open,
  mode,
  recordId,
  onClose,
  onSuccess,
}: Props) {
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const defaultValues: StockTypeFormValues = {
    name: "",
    no: "",
    parentStockTypeId: null,
    orderNo: null,
  };

  const { control, handleSubmit, reset } = useForm<StockTypeFormValues>({
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
      const res = await tblSpareType.getById(recordId, {
        include: { tblSpareType: true },
      });

      reset({
        name: res?.name ?? "",
        no: res?.no ?? "",
        parentStockTypeId: res?.tblSpareType ?? null,
        orderNo: res?.orderNo,
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
    async (values: StockTypeFormValues) => {
      const parsed = schema.safeParse(values);
      if (!parsed.success) return;

      try {
        setSubmitting(true);

        let result: TypeTblSpareType;

        const parentId = parsed.data.parentStockTypeId
          ? parsed.data.parentStockTypeId.stockTypeId
          : null;

        const parentRelation = buildRelation(
          "tblSpareType",
          "spareTypeId",
          parentId,
        );

        if (mode === "create") {
          // POST Request
          await tblSpareType.create({
            name: parsed.data.name,
            no: parsed.data.no,
            ...parentRelation,
          });
        } else {
          // PUT Request
          await tblSpareType.update(recordId!, {
            name: parsed.data.name,
            no: parsed.data.no,
            ...parentRelation,
          });
        }

        onSuccess();
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
      title={mode === "create" ? "Create Stock Type" : "Edit Stock Type"}
      submitting={submitting}
      loadingInitial={loadingInitial}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <Box display="grid" gridTemplateColumns="repeat(1, 1fr)" gap={1.5}>
        {/* No */}
        <Controller
          name="no"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              sx={{ width: "75%" }}
              {...field}
              label="No"
              size="small"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              disabled={isDisabled}
            />
          )}
        />

        {/* Name */}
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Name *"
              size="small"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              disabled={isDisabled}
            />
          )}
        />

        {/* Parent Stock Type */}
        <Controller
          name="parentStockTypeId"
          control={control}
          render={({ field, fieldState }) => (
            <AsyncSelectField
              dialogMaxWidth="sm"
              label="Parent Stock Type"
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

        {/* Order */}
        <Controller
          name="orderNo"
          control={control}
          render={({ field }) => (
            <NumberField
              {...field}
              label="Order"
              sx={{ width: "50%" }}
              size="small"
              disabled={isDisabled}
            />
          )}
        />
      </Box>
    </FormDialog>
  );
}

export default memo(StockTypeFormDialog);
