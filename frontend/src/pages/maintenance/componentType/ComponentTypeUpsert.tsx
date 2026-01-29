import * as z from "zod";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import NumberField from "@/shared/components/fields/FieldNumber";
import { memo, useEffect, useState, useCallback } from "react";
import FieldAsyncSelectGrid from "@/shared/components/fields/FieldAsyncSelectGrid";
import { buildRelation, requiredStringField } from "@/core/helper";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tblCompType, tblAddress } from "@/core/api/generated/api";

const schema = z.object({
  compTypeNo: requiredStringField(),
  compName: requiredStringField(),
  compType: requiredStringField(),
  orderNo: z.number().nullable(),
  tblCompType: z
    .object({
      compTypeId: z.number(),
      compName: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
  maker: z
    .object({
      addressId: z.number(),
      name: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
});

type CompTypeFormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  mode: "create" | "update";
  recordId?: number | null;
  onClose: () => void;
  onSuccess: () => void;
};

function ComponentTypeUpsert({
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
    orderNo: null,
  };

  const { control, handleSubmit, reset } = useForm<CompTypeFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

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
          tblCompType: true,
        },
      });

      reset({
        compTypeNo: res?.compTypeNo ?? "",
        compName: res?.compName ?? "",
        compType: res?.compType ?? "",
        orderNo: res?.orderNo ?? null,
        maker: res?.tblAddress ?? null,
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

  const onSubmitForm = useCallback(
    async (values: CompTypeFormValues) => {
      const parsed = schema.safeParse(values);
      if (!parsed.success) return;

      setSubmitting(true);

      try {
        const makerRel = buildRelation(
          "tblAddress",
          "addressId",
          parsed.data.maker?.addressId,
        );
        const parentRel = buildRelation(
          "tblCompType",
          "compTypeId",
          parsed.data.tblCompType?.compTypeId,
        );
        const payload = {
          compTypeNo: parsed.data.compTypeNo,
          compName: parsed.data.compName,
          compType: parsed.data.compType,
          orderNo: parsed.data.orderNo,
          ...makerRel,
          ...parentRel,
        };

        if (mode === "create") {
          await tblCompType.create(payload);
        } else {
          await tblCompType.update(recordId!, payload);
        }

        onSuccess();
        onClose();
      } finally {
        setSubmitting(false);
      }
    },
    [mode, recordId, onSuccess, onClose],
  );

  useEffect(() => {
    if (open) loadData();
  }, [open, loadData]);

  const isDisabled = loadingInitial || submitting;

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
              label="Code *"
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
              label="Name *"
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
              label="Type / Model"
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
            <FieldAsyncSelectGrid
              dialogMaxWidth="sm"
              label="Maker"
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
        <Controller
          name="tblCompType"
          control={control}
          render={({ field, fieldState }) => (
            <FieldAsyncSelectGrid
              dialogMaxWidth="sm"
              label="Parent "
              selectionMode="single"
              getOptionLabel={(row) => row.compName}
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

        <Controller
          name="orderNo"
          control={control}
          render={({ field, fieldState }) => (
            <NumberField
              {...field}
              label="Order No "
              size="small"
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

export default memo(ComponentTypeUpsert);
