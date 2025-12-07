import * as z from "zod";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import { memo, useEffect, useState, useCallback } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  tblCompType,
  tblAddress,
  type TypeTblCompType,
} from "@/core/api/generated/api";
import { AsyncSelectField } from "@/shared/components/AsyncSelectField";
import { buildRelation } from "@/core/api/helper";

// =======================
// VALIDATION SCHEMA
// =======================
const schema = z.object({
  compTypeNo: z.string(),
  compName: z.string(),
  compType: z.string(),

  maker: z
    .object({
      addressId: z.number(),
      name: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),

  tblCompType: z
    .object({
      compTypeId: z.number(),
      compName: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
});

export type CompTypeFormValues = z.infer<typeof schema>;

// =======================
// PROPS
// =======================
type Props = {
  open: boolean;
  mode: "create" | "update";
  recordId?: number | null;
  onClose: () => void;
  onSuccess: (data: TypeTblCompType) => void;
};

function ComponentTypeFormDialog({
  open,
  mode,
  recordId,
  onClose,
  onSuccess,
}: Props) {
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const defaultValues: CompTypeFormValues = {
    compTypeNo: "",
    compName: "",
    compType: "",
    maker: null,
    tblCompType: null,
  };

  const { control, handleSubmit, reset } = useForm<CompTypeFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // =======================
  // LOAD RECORD FOR UPDATE
  // =======================
  const loadData = useCallback(async () => {
    if (mode !== "update" || !recordId) {
      reset(defaultValues);
      return;
    }

    setLoadingInitial(true);

    try {
      const res = await tblCompType.getById(recordId, {
        include: {
          tblAddress: true,
          tblCompType: true, // parent type
        },
      });

      reset({
        compTypeNo: res?.compTypeNo ?? "",
        compName: res?.compName ?? "",
        compType: res?.compType ?? "",
        maker: res?.tblAddress ?? null,

        // 🎯 FIX: Normalize parent type to avoid recursive structure
        tblCompType: res?.tblCompType
          ? {
              compTypeId: res.tblCompType.compTypeId,
              compName: res.tblCompType.compName ?? null,
            }
          : null,
      });
    } finally {
      setLoadingInitial(false);
    }
  }, [mode, recordId, reset]);

  useEffect(() => {
    if (open) loadData();
  }, [open, loadData]);

  const isDisabled = loadingInitial || submitting;

  // =======================
  // SUBMIT HANDLER
  // =======================
  const onSubmitForm = useCallback(
    async (values: CompTypeFormValues) => {
      const parsed = schema.safeParse(values);
      if (!parsed.success) return;

      setSubmitting(true);

      try {
        const makerRel = buildRelation(
          "tblAddress",
          "addressId",
          parsed.data.maker?.addressId ?? null
        );

        const parentRel = buildRelation(
          "tblCompType",
          "compTypeId",
          parsed.data.tblCompType?.compTypeId ?? null
        );

        const payload = {
          compTypeNo: parsed.data.compTypeNo,
          compName: parsed.data.compName,
          compType: parsed.data.compType,
          ...makerRel,
          ...parentRel,
        };

        let result: TypeTblCompType;

        if (mode === "create") {
          result = await tblCompType.create(payload);
        } else {
          result = await tblCompType.update(recordId!, payload);
        }

        onSuccess(result);
        onClose();
      } finally {
        setSubmitting(false);
      }
    },
    [mode, recordId, onSuccess, onClose]
  );

  // =======================
  // RENDER FORM
  // =======================
  return (
    <FormDialog
      open={open}
      title={
        mode === "create" ? "Create Component Type" : "Edit Component Type"
      }
      onClose={onClose}
      submitting={submitting}
      loadingInitial={loadingInitial}
      onSubmit={handleSubmit(onSubmitForm)}
    >
      <Box display="grid" gridTemplateColumns="1fr" gap={1.5}>
        <Controller
          name="compTypeNo"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="compTypeNo"
              size="small"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              disabled={isDisabled}
            />
          )}
        />

        <Controller
          name="compName"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="compName"
              size="small"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              disabled={isDisabled}
            />
          )}
        />

        <Controller
          name="compType"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="compType"
              size="small"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              disabled={isDisabled}
            />
          )}
        />

        {/* Maker Address */}
        <Controller
          name="maker"
          control={control}
          render={({ field, fieldState }) => (
            <AsyncSelectField
              dialogMaxWidth="sm"
              label="Maker (Address)"
              selectionMode="single"
              value={field.value}
              request={tblAddress.getAll}
              columns={[{ field: "name", headerName: "Address", flex: 1 }]}
              getRowId={(row) => row.addressId}
              onChange={field.onChange}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              disabled={isDisabled}
            />
          )}
        />

        {/* Parent Component Type */}
        <Controller
          name="tblCompType"
          control={control}
          render={({ field, fieldState }) => (
            <AsyncSelectField
              dialogMaxWidth="sm"
              label="Parent Component Type"
              selectionMode="single"
              value={field.value}
              request={tblCompType.getAll}
              columns={[{ field: "compName", headerName: "Name", flex: 1 }]}
              getRowId={(row) => row.compTypeId}
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

export default memo(ComponentTypeFormDialog);
