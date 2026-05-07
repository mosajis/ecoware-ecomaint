import * as z from "zod";
import { memo } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import FormDialog from "@/shared/components/formDialog/FormDialog";
import { requiredStringField } from "@/core/helper";
import { tblUserGroup, TypeTblUserGroup } from "@/core/api/generated/api";

import { useUpsertForm } from "@/shared/hooks/useUpsertForm";
import { Controller } from "react-hook-form";

// === Schema
const schema = z.object({
  name: requiredStringField(),
  description: z.string().nullable(),
});

type UserGroupFormValues = z.infer<typeof schema>;

const defaultValues: UserGroupFormValues = {
  name: "",
  description: "",
};

function UserGroupUpsert({
  entityName = "User Group",
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
  } = useUpsertForm<UserGroupFormValues, TypeTblUserGroup>({
    entityName,
    open,
    mode,
    recordId,
    schema,
    defaultValues,

    onFetch: async (id) => {
      const res = await tblUserGroup.getById(id);

      return {
        name: res.name ?? "",
        description: res.description ?? "",
      };
    },

    onCreate: tblUserGroup.create,
    onUpdate: tblUserGroup.update,
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
      <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={1.5}>
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
              sx={{ gridColumn: "span 2" }}
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Description"
              size="small"
              multiline
              rows={4}
              error={!!errors.description}
              helperText={errors.description?.message}
              disabled={isDisabled}
              sx={{ gridColumn: "span 2" }}
            />
          )}
        />
      </Box>
    </FormDialog>
  );
}

export default memo(UserGroupUpsert);
