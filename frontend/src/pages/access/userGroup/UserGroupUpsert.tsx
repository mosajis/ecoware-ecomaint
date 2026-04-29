import * as z from "zod";
import { useCallback, useEffect, useMemo, useState, memo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, TextField } from "@mui/material";
import { toast } from "sonner";

import FormDialog from "@/shared/components/formDialog/FormDialog";
import { requiredStringField } from "@/core/helper";
import { tblUserGroup, TypeTblUserGroup } from "@/core/api/generated/api";

// === Schema
const schema = z.object({
  name: requiredStringField(),
  description: z.string().nullable(),
});

type UserGroupFormValues = z.infer<typeof schema>;

interface UserGroupUpsertProps {
  open: boolean;
  mode: "create" | "update";
  recordId: number | null;
  onClose: () => void;
  onSuccess: (data: TypeTblUserGroup) => void;
}

function UserGroupUpsert({
  open,
  mode,
  recordId,
  onClose,
  onSuccess,
}: UserGroupUpsertProps) {
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const defaultValues: UserGroupFormValues = useMemo(
    () => ({
      name: "",
      description: "",
    }),
    [],
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserGroupFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // === Fetch data
  const fetchData = useCallback(async () => {
    if (mode === "update" && recordId) {
      setLoadingInitial(true);
      try {
        const res = await tblUserGroup.getById(recordId);
        if (res) {
          reset({
            name: res.name ?? "",
            description: res.description ?? "",
          });
        }
      } catch (err) {
        console.error("Failed to load user group", err);
      } finally {
        setLoadingInitial(false);
      }
    } else {
      reset(defaultValues);
    }
  }, [mode, recordId, reset, defaultValues]);

  useEffect(() => {
    if (open) fetchData();
  }, [open, fetchData]);

  const isDisabled = loadingInitial || submitting;

  // === Submit
  const handleFormSubmit = useCallback(
    async (values: UserGroupFormValues) => {
      setSubmitting(true);
      try {
        let result: TypeTblUserGroup | undefined;

        if (mode === "create") {
          result = await tblUserGroup.create(values);
        } else if (mode === "update" && recordId) {
          result = await tblUserGroup.update(recordId, values);
        }

        if (result) {
          onSuccess?.(result);
          onClose();
        }
      } catch (err) {
        toast.error("Failed to submit user group");
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
      title={mode === "create" ? "Create UserGroup" : "Edit UserGroup"}
      submitting={submitting}
      loadingInitial={loadingInitial}
      onSubmit={handleSubmit(handleFormSubmit)}
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
              fullWidth
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
              fullWidth
              sx={{ gridColumn: "span 2" }}
            />
          )}
        />
      </Box>
    </FormDialog>
  );
}

export default memo(UserGroupUpsert);
