import * as z from "zod";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import NumberField from "@/shared/components/NumberField";
import { memo, useEffect, useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  tblSpareType,
  tblUnit,
  TypeTblSpareType,
} from "@/core/api/generated/api";
import { AsyncSelectField } from "@/shared/components/AsyncSelectField";
import { buildRelation } from "@/core/helper";

const schema = z.object({
  name: z.string().min(1, "Name is required"),

  partTypeNo: z.string().nullable().optional(),
  makerRefNo: z.string().nullable().optional(),
  extraNo: z.string().nullable().optional(),
  note: z.string().nullable().optional(),

  // parentSpareType: z
  //   .object({
  //     spareTypeId: z.number(),
  //     name: z.string().nullable().optional(),
  //   })
  //   .nullable()
  //   .optional(),

  unit: z
    .object({
      unitId: z.number(),
      name: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),

  orderNo: z.number().nullable().optional(),
});

export type SpareTypeFormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  mode: "create" | "update";
  recordId?: number | null;
  onClose: () => void;
  onSuccess: () => void;
};

function SpareTypeUpsert({ open, mode, recordId, onClose, onSuccess }: Props) {
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const defaultValues: SpareTypeFormValues = {
    name: "",
    partTypeNo: "",
    makerRefNo: "",
    note: "",
    extraNo: "",
    // parentSpareType: null,
    unit: null,
    orderNo: null,
  };

  const { control, handleSubmit, reset } = useForm<SpareTypeFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const fetchData = useCallback(async () => {
    if (mode !== "update" || !recordId) {
      reset(defaultValues);
      return;
    }

    setLoadingInitial(true);
    try {
      const res = await tblSpareType.getById(recordId, {
        include: {
          tblSpareType: true,
          tblUnit: true,
        },
      });

      reset({
        name: res?.name ?? "",
        extraNo: res?.extraNo ?? "",
        partTypeNo: res?.partTypeNo ?? "",
        makerRefNo: res?.makerRefNo ?? "",
        note: res?.note ?? "",
        // parentSpareType: res?.tblSpareType ?? null,
        unit: res?.tblUnit ?? null,
        orderNo: res?.orderNo ?? null,
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
    async (values: SpareTypeFormValues) => {
      const parsed = schema.safeParse(values);
      if (!parsed.success) return;

      try {
        setSubmitting(true);

        // const parentRelation = buildRelation(
        //   "tblSpareType",
        //   "spareTypeId",
        //   parsed.data.parentSpareType?.spareTypeId ?? null,
        // );

        const unitRelation = buildRelation(
          "tblUnit",
          "unitId",
          parsed.data.unit?.unitId ?? null,
        );

        const payload = {
          name: parsed.data.name,
          partTypeNo: parsed.data.partTypeNo,
          makerRefNo: parsed.data.makerRefNo,
          note: parsed.data.note,
          extraNo: parsed?.data.extraNo ?? "",
          orderNo: parsed.data.orderNo,
          // ...parentRelation,
          ...unitRelation,
        };

        if (mode === "create") {
          await tblSpareType.create(payload);
        } else {
          await tblSpareType.update(recordId!, payload);
        }

        onSuccess();
        onClose();
      } finally {
        setSubmitting(false);
      }
    },
    [mode, recordId, onClose, onSuccess],
  );

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title={mode === "create" ? "Create Spare Type" : "Edit Spare Type"}
      submitting={submitting}
      loadingInitial={loadingInitial}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <Box display="grid" gridTemplateColumns="repeat(1, 1fr)" gap={1.5}>
        {/* No */}
        <Controller
          name="partTypeNo"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              sx={{ width: "75%" }}
              {...field}
              label="MESC Code *"
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
              label="Part Name *"
              size="small"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              disabled={isDisabled}
            />
          )}
        />
        <Controller
          name="unit"
          control={control}
          render={({ field, fieldState }) => (
            <AsyncSelectField
              dialogMaxWidth="sm"
              label="Unit"
              selectionMode="single"
              value={field.value}
              request={tblUnit.getAll}
              columns={[{ field: "name", headerName: "Name", flex: 1 }]}
              getRowId={(row) => row.unitId}
              onChange={field.onChange}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              disabled={isDisabled}
            />
          )}
        />

        {/* Name */}
        <Controller
          name="makerRefNo"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="MakerRef No *"
              size="small"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              disabled={isDisabled}
            />
          )}
        />

        {/* Name */}
        <Controller
          name="extraNo"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Extra No *"
              size="small"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              disabled={isDisabled}
            />
          )}
        />

        {/* Name */}
        <Controller
          name="note"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Note"
              size="small"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              disabled={isDisabled}
            />
          )}
        />

        {/* <Controller
          name="parentSpareType"
          control={control}
          render={({ field, fieldState }) => (
            <AsyncSelectField
              dialogMaxWidth="sm"
              label="Parent Spare Type"
              selectionMode="single"
              value={field.value}
              request={tblSpareType.getAll}
              columns={[{ field: "name", headerName: "Name", flex: 1 }]}
              getRowId={(row) => row.spareTypeId}
              onChange={field.onChange}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              disabled={isDisabled}
            />
          )}
        /> */}

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

export default memo(SpareTypeUpsert);
