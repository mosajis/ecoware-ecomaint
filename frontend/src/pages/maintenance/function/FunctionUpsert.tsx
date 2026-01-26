import * as z from "zod";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { buildRelation } from "@/core/helper";
import { AsyncSelectField } from "@/shared/components/AsyncSelectField";
import { memo, useCallback, useEffect, useState } from "react";
import { tblFunctions, TypeTblFunctions } from "@/core/api/generated/api";

// =======================
// VALIDATION SCHEMA
// =======================
const schema = z.object({
  funcNo: z.string().min(1, "Function No is required"),
  funcDescr: z.string().min(1, "Function Description is required"),
  funcRef: z.string().nullable().optional(),

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
// PROPS
// =======================
type Props = {
  open: boolean;
  mode: "create" | "update";
  recordId?: number | null;
  onClose: () => void;
  onSuccess: (data: TypeTblFunctions) => void;
};

function FunctionUpsert({ open, mode, recordId, onClose, onSuccess }: Props) {
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const defaultValues: FunctionFormValues = {
    funcNo: "",
    funcDescr: "",
    funcRef: "",
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
        include: { tblFunctions: true, tblComponentUnit: true },
      });

      reset({
        funcNo: res?.funcNo ?? "",
        funcDescr: res?.funcDescr ?? "",
        funcRef: res?.funcRef ?? "",

        parent: res?.tblFunctions
          ? {
              functionId: res.tblFunctions.functionId,
              funcNo: res.tblFunctions.funcDescr ?? null,
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
        const d = parsed.data;

        const payload = {
          funcNo: d.funcNo,
          funcDescr: d.funcDescr,
          funcRef: d.funcRef ?? "",

          ...buildRelation("tblFunctions", "functionId", d.parent?.functionId),
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
    [mode, recordId, onClose, onSuccess],
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
      <Box display="flex" flexDirection={"column"} gap={1.5}>
        {/* Function No */}
        <Controller
          name="funcNo"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Function No"
              size="small"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              disabled={isDisabled}
            />
          )}
        />

        {/* Function Description */}
        <Controller
          name="funcDescr"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Function Description"
              size="small"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              disabled={isDisabled}
            />
          )}
        />

        {/* Function Ref */}
        <Controller
          name="funcRef"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Function Reference"
              size="small"
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
              getOptionLabel={(row) => row.funcNo}
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

export default memo(FunctionUpsert);
