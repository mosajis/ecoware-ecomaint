import * as z from "zod";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import Box from "@mui/material/Box";
import { memo, useEffect, useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AsyncSelectField } from "@/shared/components/AsyncSelectField";
import { buildRelation } from "@/core/helper";
import {
  tblSpareType,
  tblSpareUnit,
  TypeTblSpareUnit,
} from "@/core/api/generated/api";

// === Validation Schema ===
const schema = z.object({
  spareTypeId: z
    .object({
      spareTypeId: z.number(),
      name: z.string().nullable().optional(),
    })
    .nullable(),
});

export type SpareUnitFormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  mode: "create" | "update";
  recordId?: number | null;
  onClose: () => void;
  onSuccess: (data: TypeTblSpareUnit) => void;
};

function SpareUnitFormDialog({
  open,
  mode,
  recordId,
  onClose,
  onSuccess,
}: Props) {
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const defaultValues: SpareUnitFormValues = {
    spareTypeId: null,
  };

  const { control, handleSubmit, reset } = useForm<SpareUnitFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // === Load record in edit mode ===
  const fetchData = useCallback(async () => {
    if (mode !== "update" || !recordId) {
      reset(defaultValues);
      return;
    }

    setLoadingInitial(true);

    try {
      const res = await tblSpareUnit.getById(recordId, {
        include: { tblSpareType: true },
      });

      reset({
        spareTypeId: res?.tblSpareType ?? null,
      });
    } finally {
      setLoadingInitial(false);
    }
  }, [mode, recordId, reset]);

  useEffect(() => {
    if (open) fetchData();
  }, [open, fetchData]);

  const isDisabled = loadingInitial || submitting;

  // === Submit Handler ===
  const handleFormSubmit = useCallback(
    async (values: SpareUnitFormValues) => {
      const parsed = schema.safeParse(values);
      if (!parsed.success) return;

      try {
        setSubmitting(true);

        let result: TypeTblSpareUnit;

        const spareTypeId = parsed.data.spareTypeId?.spareTypeId ?? null;

        const spareTypeRelation = buildRelation(
          "tblSpareType",
          "spareTypeId",
          spareTypeId,
        );

        if (mode === "create") {
          // POST Request
          result = await tblSpareUnit.create({
            ...spareTypeRelation,
          });
        } else {
          // PUT Request
          result = await tblSpareUnit.update(recordId!, {
            ...spareTypeRelation,
          });
        }

        onSuccess(result);
        onClose();
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
      title={mode === "create" ? "Create Spare Item" : "Edit Spare Item"}
      submitting={submitting}
      loadingInitial={loadingInitial}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <Box display="grid" gridTemplateColumns="repeat(1, 1fr)" gap={1.5}>
        {/* Spare Type Select */}
        <Controller
          name="spareTypeId"
          control={control}
          render={({ field, fieldState }) => (
            <AsyncSelectField
              dialogMaxWidth="sm"
              label="Spare Type"
              selectionMode="single"
              value={field.value}
              request={tblSpareType.getAll}
              columns={[{ field: "name", headerName: "Name", flex: 1 }]}
              getRowId={(row) => row.spareTypeId}
              onChange={field.onChange}
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

export default memo(SpareUnitFormDialog);
