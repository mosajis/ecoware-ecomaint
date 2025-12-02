import { memo, useEffect, useMemo, useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Box, TextField } from "@mui/material";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import { tblDiscipline, TypeTblDiscipline } from "@/core/api/generated/api";

// === Validation Schema ===
const schema = z.object({
  name: z.string().min(1, "Name is required").nullable(),
});

export type DisciplineFormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  mode: "create" | "update";
  recordId?: number | null;
  onClose: () => void;
  onSuccess: (data: TypeTblDiscipline) => void;
};

function DisciplineFormDialog({
  open,
  mode,
  recordId,
  onClose,
  onSuccess,
}: Props) {
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const defaultValues: DisciplineFormValues = useMemo(() => ({ name: "" }), []);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DisciplineFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // === Fetch data for update mode
  const fetchData = useCallback(async () => {
    if (mode === "update" && recordId) {
      setLoadingInitial(true);
      try {
        const res = await tblDiscipline.getById(recordId);
        reset({ name: res?.name ?? "" }); // map null to empty string
      } catch (err) {
        console.error("Failed to fetch discipline", err);
        reset(defaultValues);
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

  const handleFormSubmit = useCallback(
    async (values: DisciplineFormValues) => {
      setSubmitting(true);
      try {
        let result: TypeTblDiscipline;
        if (mode === "create") {
          result = await tblDiscipline.create(values);
        } else if (mode === "update" && recordId) {
          result = await tblDiscipline.update(recordId, values);
        } else {
          return;
        }
        onSuccess(result);
        onClose();
      } catch (err) {
        console.error("Submit failed", err);
      } finally {
        setSubmitting(false);
      }
    },
    [mode, recordId, onSuccess, onClose]
  );

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title={mode === "create" ? "Create Discipline" : "Edit Discipline"}
      submitting={submitting}
      loadingInitial={loadingInitial}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={1.5}>
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
              sx={{ gridColumn: "span 4" }}
            />
          )}
        />
      </Box>
    </FormDialog>
  );
}

export default memo(DisciplineFormDialog);
