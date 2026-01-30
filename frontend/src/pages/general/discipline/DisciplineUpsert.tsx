import * as z from "zod";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import FieldNumber from "@/shared/components/fields/FieldNumber";
import { memo, useEffect, useMemo, useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tblDiscipline, TypeTblDiscipline } from "@/core/api/generated/api";
import { requiredStringField } from "@/core/helper";

// === Validation Schema ===
const schema = z.object({
  name: requiredStringField(),
  orderNo: z.number().nullable(),
});

export type DisciplineFormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  mode: "create" | "update";
  recordId?: number | null;
  onClose: () => void;
  onSuccess: (data: TypeTblDiscipline) => void;
};

function DisciplineUpsert({ open, mode, recordId, onClose, onSuccess }: Props) {
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const defaultValues: DisciplineFormValues = useMemo(
    () => ({ name: "", orderNo: null }),
    [],
  );

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
        reset({ name: res?.name ?? "", orderNo: res?.orderNo }); // map null to empty string
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
    [mode, recordId, onSuccess, onClose],
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
      <Box gap={1.5} display={"flex"} flexDirection={"column"}>
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
              sx={{ width: "100%" }}
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
              sx={{ width: "30%" }}
            />
          )}
        />
      </Box>
    </FormDialog>
  );
}

export default memo(DisciplineUpsert);
