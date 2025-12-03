import * as z from "zod";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import { memo, useCallback, useEffect, useState } from "react";
import { Box, TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AsyncSelectField } from "@/shared/components/AsyncSelectField";
import { tblFunctions, TypeTblFunctions } from "@/core/api/generated/api";

// =======================
// VALIDATION SCHEMA
// =======================
const schema = z.object({
  functionName: z.string(),

  parent: z
    .object({
      functionId: z.number(),
      funcDescr: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
});

export type FunctionFormValues = z.infer<typeof schema>;

// =======================
// PROPS
// =======================
type Props = {
  open: boolean;
  mode: "create" | "update";
  recordId?: number | null;
  onClose: () => void;
  onSuccess: (data: TypeTblFunctions) => void;
};

function FunctionFormDialog({
  open,
  mode,
  recordId,
  onClose,
  onSuccess,
}: Props) {
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const defaultValues: FunctionFormValues = {
    functionName: "",
    parent: null,
  };

  const { control, handleSubmit, reset } = useForm<FunctionFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // =======================
  // LOAD RECORD FOR UPDATE
  // =======================
  const loadData = useCallback(async () => {
    if (mode !== "update" || !recordId) {
      reset(defaultValues);
      return;
    }

    setLoadingInitial(true);
    try {
      const res = await tblFunctions.getById(recordId, {
        include: { tblFunctions: true }, // parent
      });

      reset({
        functionName: res?.funcDescr ?? "",
        parent: res?.tblFunctions
          ? {
              functionId: res.tblFunctions.functionId,
              funcDescr: res.tblFunctions.funcDescr ?? null,
            }
          : null,
      });
    } finally {
      setLoadingInitial(false);
    }
  }, [mode, recordId, reset]);

  useEffect(() => {
    if (open) loadData();
  }, [open, loadData]);

  const isDisabled = submitting || loadingInitial;

  // =======================
  // SUBMIT HANDLER
  // =======================
  const onSubmitForm = useCallback(
    async (values: FunctionFormValues) => {
      const parsed = schema.safeParse(values);
      if (!parsed.success) return;

      setSubmitting(true);

      try {
        const payload = {
          funcDescr: parsed.data.functionName,

          // parentFunctionId → ست کردن آی‌دی پدر
          parentFunctionId: parsed.data.parent?.functionId ?? null,
        };

        let result: TypeTblFunctions;

        if (mode === "create") {
          result = await tblFunctions.create(payload);
        } else {
          result = await tblFunctions.update(recordId!, payload);
        }

        onSuccess(result);
        onClose();
      } finally {
        setSubmitting(false);
      }
    },
    [mode, recordId, onClose, onSuccess]
  );

  // =======================
  // RENDER FORM
  // =======================
  return (
    <FormDialog
      open={open}
      title={mode === "create" ? "Create Function" : "Edit Function"}
      loadingInitial={loadingInitial}
      submitting={submitting}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmitForm)}
    >
      <Box display="grid" gridTemplateColumns="1fr" gap={1.5}>
        {/* Function Name */}
        <Controller
          name="functionName"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Function Name"
              size="small"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              disabled={isDisabled}
            />
          )}
        />

        {/* Parent Function */}
        <Controller
          name="parent"
          control={control}
          render={({ field, fieldState }) => (
            <AsyncSelectField
              dialogMaxWidth="sm"
              label="Parent Function"
              selectionMode="single"
              request={tblFunctions.getAll}
              value={field.value}
              onChange={field.onChange}
              columns={[
                {
                  field: "funcDescr",
                  headerName: "Description",
                  flex: 1,
                },
              ]}
              getRowId={(row) => row.functionId}
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

export default memo(FunctionFormDialog);
