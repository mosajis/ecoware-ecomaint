import * as z from "zod";
import { memo } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import FormDialog from "@/shared/components/formDialog/FormDialog";
import NumberField from "@/shared/components/fields/FieldNumber";
import FieldAsyncSelectGrid from "@/shared/components/fields/FieldAsyncSelectGrid";

import { buildRelation, requiredStringField } from "@/core/helper";
import {
  tblCompType,
  tblAddress,
  TypeTblCompType,
} from "@/core/api/generated/api";

import { useUpsertForm } from "@/shared/hooks/useUpsertForm";
import { Controller } from "react-hook-form";

// =======================
// schema
// =======================
const schema = z.object({
  compTypeNo: requiredStringField(),
  compName: requiredStringField(),
  compType: z.string().nullable().optional(),
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

export type CompTypeFormValues = z.infer<typeof schema>;

// =======================
// default values
// =======================
const defaultValues: CompTypeFormValues = {
  compTypeNo: "",
  compName: "",
  compType: "",
  orderNo: null,
  maker: undefined,
  tblCompType: undefined,
};

// =======================
// component
// =======================
function ComponentTypeUpsert({
  entityName = "Component Type",
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
  } = useUpsertForm<CompTypeFormValues, TypeTblCompType>({
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
      const res = await tblCompType.getById(id, {
        include: {
          tblAddress: true,
          tblCompType: true,
        },
      });

      return {
        compTypeNo: res?.compTypeNo ?? "",
        compName: res?.compName ?? "",
        compType: res?.compType ?? "",
        orderNo: res?.orderNo ?? null,
        maker: res.tblAddress,
        tblCompType: res.tblCompType,
      };
    },

    // =======================
    // create
    // =======================
    onCreate: async (values) => {
      console.log(values);
      const payload = {
        compTypeNo: values.compTypeNo,
        compName: values.compName,
        compType: values.compType,
        orderNo: values.orderNo,

        ...buildRelation("tblAddress", "addressId", values.maker),
        ...buildRelation("tblCompType", "compTypeId", values.tblCompType),
      };

      return tblCompType.create(payload);
    },

    // =======================
    // update
    // =======================
    onUpdate: async (id, values) => {
      const payload = {
        compTypeNo: values.compTypeNo,
        compName: values.compName,
        compType: values.compType,
        orderNo: values.orderNo,

        ...buildRelation("tblAddress", "addressId", values.maker),
        ...buildRelation("tblCompType", "compTypeId", values.tblCompType),
      };

      return tblCompType.update(id, payload);
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
      <Box display="grid" gridTemplateColumns="1fr" gap={1.5}>
        {/* Code */}
        <Controller
          name="compTypeNo"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Code *"
              size="small"
              sx={{ width: "40%" }}
              error={!!errors.compTypeNo}
              helperText={errors.compTypeNo?.message}
              disabled={isDisabled}
            />
          )}
        />

        {/* Name */}
        <Controller
          name="compName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Name *"
              size="small"
              error={!!errors.compName}
              helperText={errors.compName?.message}
              disabled={isDisabled}
            />
          )}
        />

        {/* Type */}
        <Controller
          name="compType"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Type / Model"
              size="small"
              error={!!errors.compType}
              helperText={errors.compType?.message}
              disabled={isDisabled}
            />
          )}
        />

        {/* Maker */}
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

        {/* Parent */}
        <Controller
          name="tblCompType"
          control={control}
          render={({ field, fieldState }) => {
            console.log(field.value);
            return (
              <FieldAsyncSelectGrid
                dialogMaxWidth="sm"
                label="Parent"
                selectionMode="single"
                getOptionLabel={(row) => row.compName}
                request={tblCompType.getAll}
                columns={[{ field: "compName", headerName: "Name", flex: 1 }]}
                getRowId={(row) => row.compTypeId}
                onChange={field.onChange}
                value={field.value}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                disabled={isDisabled}
              />
            );
          }}
        />

        {/* Order */}
        <Controller
          name="orderNo"
          control={control}
          render={({ field }) => (
            <NumberField
              {...field}
              label="Order No"
              size="small"
              sx={{ width: "40%" }}
              error={!!errors.orderNo}
              helperText={errors.orderNo?.message}
              disabled={isDisabled}
            />
          )}
        />
      </Box>
    </FormDialog>
  );
}

export default memo(ComponentTypeUpsert);
