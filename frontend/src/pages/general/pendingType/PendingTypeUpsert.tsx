import { memo, useEffect, useState, useCallback, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import NumberField from "@/shared/components/fields/FieldNumber";
import { tblPendingType, TypeTblPendingType } from "@/core/api/generated/api";
import { buildRelation, requiredStringField } from "@/core/helper";
import FieldAsyncSelectGrid from "@/shared/components/fields/FieldAsyncSelectGrid";

const schema = z.object({
  pendTypeName: requiredStringField(),
  description: z.string().nullable(),
  orderNo: z.number().nullable(),
  parentPendingTypeId: z
    .object({
      pendTypeId: z.number(),
      pendTypeName: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
});

export type PendingTypeFormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  mode: "create" | "update";
  recordId?: number | null;
  onClose: () => void;
  onSuccess: (data: TypeTblPendingType) => void;
};

function PendingTypeUpsert({
  open,
  mode,
  recordId,
  onClose,
  onSuccess,
}: Props) {
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [parentPending, setParentPending] = useState<TypeTblPendingType | null>(
    null,
  );

  const defaultValues: PendingTypeFormValues = useMemo(
    () => ({
      pendTypeName: "",
      description: "",
      orderNo: null,
    }),
    [],
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PendingTypeFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const fetchData = useCallback(async () => {
    if (mode === "update" && recordId) {
      setLoadingInitial(true);
      try {
        const res = await tblPendingType.getById(recordId);
        reset({
          pendTypeName: res?.pendTypeName ?? "",
          description: res?.description ?? "",
          orderNo: res?.orderNo ?? null,
          parentPendingTypeId: res?.tblPendingType ?? null,
        });

        if (res?.tblPendingType) {
          setParentPending(res.tblPendingType);
        } else {
          setParentPending(null);
        }
      } catch (err) {
        console.error("Failed to fetch Pending Type", err);
        reset(defaultValues);
      } finally {
        setLoadingInitial(false);
      }
    } else {
      reset(defaultValues);
      setParentPending(null);
    }
  }, [mode, recordId, reset, defaultValues]);

  useEffect(() => {
    if (open) fetchData();
  }, [open, fetchData]);

  const isDisabled = loadingInitial || submitting;

  const handleFormSubmit = useCallback(
    async (values: PendingTypeFormValues) => {
      setSubmitting(true);
      try {
        const payload = {
          pendTypeName: values.pendTypeName ?? "",
          description: values.description ?? "",
          orderNo: values.orderNo,
        };

        let result: TypeTblPendingType;
        if (mode === "create") {
          result = await tblPendingType.create(payload);
        } else if (mode === "update" && recordId) {
          result = await tblPendingType.update(recordId, payload);
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
      title={mode === "create" ? "Create Pending Type" : "Edit Pending Type"}
      submitting={submitting}
      loadingInitial={loadingInitial}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={1.5}>
        {/* Name */}
        <Controller
          name="pendTypeName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Name *"
              size="small"
              error={!!errors.pendTypeName}
              helperText={errors.pendTypeName?.message}
              disabled={isDisabled}
              sx={{ gridColumn: "span 4" }}
            />
          )}
        />

        {/* Description */}
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Description"
              size="small"
              disabled={isDisabled}
              sx={{ gridColumn: "span 3" }}
            />
          )}
        />
        {/* Order No */}
        <Controller
          name="orderNo"
          control={control}
          render={({ field, fieldState }) => (
            <NumberField
              {...field}
              sx={{ gridColumn: "span 1" }}
              label="Order No"
              size="small"
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

export default memo(PendingTypeUpsert);
