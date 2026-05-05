import * as z from "zod";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import FieldNumber from "@/shared/components/fields/FieldNumber";

import { memo } from "react";
import { Controller } from "react-hook-form";
import { tblFollowStatus, TypeTblFollowStatus } from "@/core/api/generated/api";
import { requiredStringField } from "@/core/helper";
import { useUpsertForm } from "@/shared/hooks/useUpsertForm";

// === Schema ===
const schema = z.object({
  fsName: requiredStringField(),
  fsDesc: z.string().nullable(),
  orderNo: z.number().nullable(),
});

export type FollowStatusFormValues = z.infer<typeof schema>;

const defaultValues: FollowStatusFormValues = {
  fsName: "",
  fsDesc: "",
  orderNo: null,
};

function FollowStatusUpsert({
  entityName,
  open,
  mode,
  recordId,
  onClose,
  onSuccess,
}: UpsertProps<TypeTblFollowStatus>) {
  const {
    form,
    loadingInitial,
    submitting,
    isDisabled,
    readonly,
    title,
    handleFormSubmit,
  } = useUpsertForm<FollowStatusFormValues, TypeTblFollowStatus>({
    entityName,
    open,
    mode,
    recordId,
    schema,
    defaultValues,

    onFetch: async (id) => {
      const res = await tblFollowStatus.getById(id);

      return {
        fsName: res?.fsName ?? "",
        fsDesc: res?.fsDesc ?? "",
        orderNo: res?.orderNo ?? null,
      };
    },

    onCreate: (data) => tblFollowStatus.create(data),

    onUpdate: (id, data) => tblFollowStatus.update(id, data),

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
      <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={1.5}>
        <Controller
          name="fsName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Name *"
              size="small"
              error={!!errors.fsName}
              helperText={errors.fsName?.message}
              disabled={isDisabled}
              sx={{ gridColumn: "span 4" }}
            />
          )}
        />

        <Controller
          name="fsDesc"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Description"
              size="small"
              error={!!errors.fsDesc}
              helperText={errors.fsDesc?.message}
              disabled={isDisabled}
              sx={{ gridColumn: "span 4" }}
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

export default memo(FollowStatusUpsert);
