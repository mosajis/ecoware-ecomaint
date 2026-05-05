import * as z from "zod";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import FieldNumber from "@/shared/components/fields/FieldNumber";
import { memo } from "react";
import { Controller } from "react-hook-form";
import {
  tblSpareType,
  tblUnit,
  TypeTblSpareType,
} from "@/core/api/generated/api";
import FieldAsyncSelectGrid from "@/shared/components/fields/FieldAsyncSelectGrid";
import { buildRelation } from "@/core/helper";
import { requiredStringField } from "@/core/helper";
import { useUpsertForm } from "@/shared/hooks/useUpsertForm";

// === Schema ===
const schema = z.object({
  name: requiredStringField(),

  partTypeNo: z.string().nullable().optional(),
  makerRefNo: z.string().nullable().optional(),
  extraNo: z.string().nullable().optional(),
  note: z.string().nullable().optional(),

  unit: z
    .object({
      unitId: z.number(),
      name: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),

  orderNo: z.number().nullable().optional(),
});

type SpareTypeFormValues = z.infer<typeof schema>;

const defaultValues: SpareTypeFormValues = {
  name: "",
  partTypeNo: "",
  makerRefNo: "",
  extraNo: "",
  note: "",
  unit: null,
  orderNo: null,
};

function SpareTypeUpsert({
  entityName,
  open,
  mode,
  recordId,
  onClose,
  onSuccess,
}: UpsertProps<TypeTblSpareType>) {
  const {
    form,
    loadingInitial,
    submitting,
    isDisabled,
    readonly,
    title,
    handleFormSubmit,
  } = useUpsertForm<SpareTypeFormValues, TypeTblSpareType>({
    entityName,
    open,
    mode,
    recordId,
    schema,
    defaultValues,

    onFetch: async (id) => {
      const res = await tblSpareType.getById(id, {
        include: { tblUnit: true },
      });

      return {
        name: res.name ?? "",
        partTypeNo: res.partTypeNo ?? "",
        makerRefNo: res.makerRefNo ?? "",
        extraNo: res.extraNo ?? "",
        note: res.note ?? "",
        unit: res.tblUnit
          ? {
              unitId: res.tblUnit.unitId,
              name: res.tblUnit.name ?? "",
            }
          : null,
        orderNo: res.orderNo ?? null,
      };
    },

    onCreate: async (values) => {
      const unitRelation = buildRelation(
        "tblUnit",
        "unitId",
        values.unit?.unitId,
      );

      return tblSpareType.create({
        name: values.name,
        partTypeNo: values.partTypeNo,
        makerRefNo: values.makerRefNo,
        extraNo: values.extraNo,
        note: values.note,
        orderNo: values.orderNo,
        ...unitRelation,
      });
    },

    onUpdate: async (id, values) => {
      const unitRelation = buildRelation(
        "tblUnit",
        "unitId",
        values.unit?.unitId,
      );

      return tblSpareType.update(id, {
        name: values.name,
        partTypeNo: values.partTypeNo,
        makerRefNo: values.makerRefNo,
        extraNo: values.extraNo,
        note: values.note,
        orderNo: values.orderNo,
        ...unitRelation,
      });
    },

    onSuccess,
    onClose,
  });

  const {
    control,
    formState: { errors },
  } = form;

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title={title}
      submitting={submitting}
      loadingInitial={loadingInitial}
      onSubmit={handleFormSubmit}
      readonly={readonly}
    >
      <Box display="grid" gridTemplateColumns="repeat(1, 1fr)" gap={1.5}>
        <Controller
          name="partTypeNo"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="MESC Code"
              size="small"
              disabled={isDisabled}
              sx={{ width: "75%" }}
            />
          )}
        />

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
            <FieldAsyncSelectGrid
              dialogMaxWidth="sm"
              label="Unit"
              selectionMode="single"
              value={field.value}
              request={tblUnit.getAll}
              columns={[
                { field: "name", headerName: "Name", flex: 1 },
                { field: "description", headerName: "Description", flex: 1 },
              ]}
              getRowId={(row) => row.unitId}
              onChange={field.onChange}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              disabled={isDisabled}
            />
          )}
        />

        <Controller
          name="makerRefNo"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Maker Ref No"
              size="small"
              disabled={isDisabled}
            />
          )}
        />

        <Controller
          name="extraNo"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Extra No"
              size="small"
              disabled={isDisabled}
            />
          )}
        />

        <Controller
          name="note"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Note"
              size="small"
              disabled={isDisabled}
            />
          )}
        />

        <Controller
          name="orderNo"
          control={control}
          render={({ field }) => (
            <FieldNumber
              {...field}
              label="Order No"
              size="small"
              disabled={isDisabled}
              sx={{ width: "50%" }}
            />
          )}
        />
      </Box>
    </FormDialog>
  );
}

export default memo(SpareTypeUpsert);
