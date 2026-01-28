import * as z from "zod";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { buildRelation, requiredStringField } from "@/core/helper";
import { AsyncSelectGridField } from "@/shared/components/fields/FieldAsyncSelectGrid";
import { memo, useCallback, useEffect, useState } from "react";
import { tblFunctions, TypeTblFunctions } from "@/core/api/generated/api";
import NumberField from "@/shared/components/fields/FieldNumber";

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
    funcDesc: "",
    parent: null,
    orderNo: null,
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
        funcDesc: res?.funcDesc ?? "",
        orderNo: res?.orderNo,
        parent: res?.tblFunctions
          ? {
              functionId: res.tblFunctions.functionId,
              funcNo: res.tblFunctions.funcNo,
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
          funcDesc: d.funcDesc,
          orderNo: d.orderNo,
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
          name="funcDesc"
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

        {/* Function Description */}
        <Controller
          name="orderNo"
          control={control}
          render={({ field, fieldState }) => (
            <NumberField
              {...field}
              sx={{ width: "30%" }}
              label="Order No"
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
            <AsyncSelectGridField
              dialogMaxWidth="sm"
              label="Parent Function"
              getOptionLabel={(row) => row.funcNo}
              selectionMode="single"
              request={tblFunctions.getAll}
              value={field.value}
              onChange={field.onChange}
              columns={[
                {
                  field: "funcNo",
                  headerName: "Function No",
                  flex: 1,
                },
                {
                  field: "funcDesc",
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
