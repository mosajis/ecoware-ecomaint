import * as z from "zod";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import NumberField from "@/shared/components/fields/FieldNumber";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FieldAsyncSelectGrid from "@/shared/components/fields/FieldAsyncSelectGrid";
import { memo } from "react";
import { Controller } from "react-hook-form";
import { tblLocation, TypeTblLocation } from "@/core/api/generated/api";
import { buildRelation, requiredStringField } from "@/core/helper";
import { useUpsertForm } from "@/shared/hooks/useUpsertForm";

// === Schema ===
const schema = z.object({
  name: requiredStringField(),
  locationCode: requiredStringField(),
  orderNo: z.number().nullable(),
  parentLocationId: z
    .object({
      locationId: z.number(),
      name: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
});

type LocationFormValues = z.infer<typeof schema>;

const defaultValues: LocationFormValues = {
  name: "",
  locationCode: "",
  parentLocationId: null,
  orderNo: null,
};

function LocationUpsert({
  entityName,
  open,
  mode,
  recordId,
  onClose,
  onSuccess,
}: UpsertProps<TypeTblLocation>) {
  const {
    form,
    loadingInitial,
    submitting,
    isDisabled,
    readonly,
    title,
    handleFormSubmit,
  } = useUpsertForm<LocationFormValues, TypeTblLocation>({
    entityName,
    open,
    mode,
    recordId,
    schema,
    defaultValues,

    onFetch: async (id) => {
      const res = await tblLocation.getById(id, {
        include: { tblLocation: true },
      });

      return {
        name: res?.name ?? "",
        locationCode: res?.locationCode ?? "",
        parentLocationId: res?.tblLocation ?? null,
        orderNo: res?.orderNo ?? null,
      };
    },

    onCreate: async (data) => {
      const parentId = data.parentLocationId?.locationId ?? null;

      return tblLocation.create({
        name: data.name,
        locationCode: data.locationCode,
        orderNo: data.orderNo,
        ...buildRelation("tblLocation", "locationId", parentId),
      });
    },

    onUpdate: async (id, data) => {
      const parentId = data.parentLocationId?.locationId ?? null;

      return tblLocation.update(id, {
        name: data.name,
        locationCode: data.locationCode,
        orderNo: data.orderNo,
        ...buildRelation("tblLocation", "locationId", parentId),
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
        {/* Code */}
        <Controller
          name="locationCode"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Code *"
              size="small"
              error={!!errors.locationCode}
              helperText={errors.locationCode?.message}
              disabled={isDisabled}
              sx={{ width: "80%" }}
            />
          )}
        />

        {/* Name */}
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Name *"
              size="small"
              error={!!errors.name}
              helperText={errors.name?.message}
              disabled={isDisabled}
            />
          )}
        />

        {/* Parent */}
        <Controller
          name="parentLocationId"
          control={control}
          render={({ field }) => (
            <FieldAsyncSelectGrid
              disabled={isDisabled}
              dialogMaxWidth="sm"
              label="Parent Location"
              selectionMode="single"
              value={field.value}
              request={tblLocation.getAll}
              columns={[{ field: "name", headerName: "Name", flex: 1 }]}
              getRowId={(row) => row.locationId}
              onChange={field.onChange}
              error={!!errors.parentLocationId}
              helperText={errors.parentLocationId?.message}
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

export default memo(LocationUpsert);
