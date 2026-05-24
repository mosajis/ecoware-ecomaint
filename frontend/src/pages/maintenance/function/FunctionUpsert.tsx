import * as z from "zod";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import FieldAsyncSelectGrid from "@/shared/components/fields/FieldAsyncSelectGrid";
import NumberField from "@/shared/components/fields/FieldNumber";
import { memo } from "react";
import { buildRelation, requiredStringField } from "@/core/helper";
import { tblFunction, TypeTblFunction } from "@/core/api/generated/api";
import { useUpsertForm } from "@/shared/hooks/useUpsertForm";
import { PERMIT_ID } from "./FunctionPermit";
import { Controller } from "react-hook-form";

// =======================
// schema
// =======================
const schema = z.object({
  funcNo: requiredStringField(),
  funcDesc: z.string().optional().nullable(),
  orderNo: z.number().nullable(),

  parent: z
    .object({
      functionId: z.number(),
      funcNo: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
});

export type FunctionFormValues = z.infer<typeof schema>;

// =======================
// default values
// =======================
const defaultValues: FunctionFormValues = {
  funcNo: "",
  funcDesc: "",
  orderNo: null,
  parent: undefined,
};

// =======================
// component
// =======================
function FunctionUpsert({
  entityName = "Function",
  open,
  mode,
  recordId,
  onClose,
  onSuccess,
}: UpsertProps) {
  const {
    form,
    loadingInitial,
    submitting,
    isDisabled,
    readonly,
    title,
    handleFormSubmit,
  } = useUpsertForm<FunctionFormValues, TypeTblFunction>({
    entityName,
    open,
    mode,
    recordId,
    schema,
    defaultValues,

    // =======================
    // fetch
    // =======================
    onFetch: async (id) => {
      const res = await tblFunction.getById(id, {
        include: {
          tblFunction: true,
          tblComponentUnit: true,
        },
      });

      return {
        funcNo: res?.funcNo ?? "",
        funcDesc: res?.funcDesc ?? "",
        orderNo: res?.orderNo ?? null,
        parent: res?.tblFunction,
      };
    },

    // =======================
    // create
    // =======================
    onCreate: async (values) => {
      const payload = {
        ...values,
        ...buildRelation("tblFunction", "functionId", values.parent),
      };

      console.log(values);
      return tblFunction.create(payload);
    },

    // =======================
    // update
    // =======================
    onUpdate: async (id, values) => {
      const payload = {
        ...values,
        ...buildRelation("tblFunction", "functionId", values.parent),
      };

      return tblFunction.update(id, payload);
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
      title={title}
      loadingInitial={loadingInitial}
      submitting={submitting}
      onClose={onClose}
      onSubmit={handleFormSubmit}
      readonly={readonly}
    >
      <Box display="flex" flexDirection="column" gap={1.5}>
        {/* funcNo */}
        <Controller
          name="funcNo"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Function No"
              size="small"
              error={!!errors.funcNo}
              helperText={errors.funcNo?.message}
              disabled={isDisabled}
            />
          )}
        />

        {/* funcDesc */}
        <Controller
          name="funcDesc"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Function Description"
              size="small"
              error={!!errors.funcDesc}
              helperText={errors.funcDesc?.message}
              disabled={isDisabled}
            />
          )}
        />

        {/* orderNo */}
        <Controller
          name="orderNo"
          control={control}
          render={({ field }) => (
            <NumberField
              {...field}
              label="Order No"
              size="small"
              sx={{ width: "30%" }}
              error={!!errors.orderNo}
              helperText={errors.orderNo?.message}
              disabled={isDisabled}
            />
          )}
        />

        {/* parent */}
        <Controller
          name="parent"
          control={control}
          render={({ field, fieldState }) => (
            <FieldAsyncSelectGrid
              elementId={PERMIT_ID}
              dialogMaxWidth="sm"
              label="Parent Function"
              selectionMode="single"
              request={tblFunction.getAll}
              value={field.value}
              onChange={field.onChange}
              getOptionLabel={(row) => row.funcNo}
              getRowId={(row) => row.functionId}
              columns={[
                { field: "funcNo", headerName: "Function No", flex: 1 },
                { field: "funcDesc", headerName: "Description", flex: 1 },
              ]}
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

export default memo(FunctionUpsert);
