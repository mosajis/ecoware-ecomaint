import * as z from "zod";
import Box from "@mui/material/Box";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import { memo } from "react";
import { Controller } from "react-hook-form";
import FieldAsyncSelectGrid from "@/shared/components/fields/FieldAsyncSelectGrid";
import { buildRelation } from "@/core/helper";
import {
  tblSpareType,
  tblSpareUnit,
  TypeTblSpareUnit,
} from "@/core/api/generated/api";
import { useUpsertForm } from "@/shared/hooks/useUpsertForm";

// === Schema ===
const schema = z.object({
  spareTypeId: z
    .object({
      spareTypeId: z.number(),
      name: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
});

type SpareUnitFormValues = z.infer<typeof schema>;

const defaultValues: SpareUnitFormValues = {
  spareTypeId: null,
};

function SpareUnitUpsert({
  entityName,
  open,
  mode,
  recordId,
  onClose,
  onSuccess,
}: UpsertProps<TypeTblSpareUnit>) {
  const {
    form,
    loadingInitial,
    submitting,
    isDisabled,
    readonly,
    title,
    handleFormSubmit,
  } = useUpsertForm<SpareUnitFormValues, TypeTblSpareUnit>({
    entityName,
    open,
    mode,
    recordId,
    schema,
    defaultValues,

    onFetch: async (id) => {
      const res = await tblSpareUnit.getById(id, {
        include: { tblSpareType: true },
      });

      return {
        spareTypeId: res?.tblSpareType
          ? {
              spareTypeId: res.tblSpareType.spareTypeId,
              name: res.tblSpareType.name ?? "",
            }
          : null,
      };
    },

    onCreate: async (values) => {
      const spareTypeRelation = buildRelation(
        "tblSpareType",
        "spareTypeId",
        values.spareTypeId?.spareTypeId,
      );

      return tblSpareUnit.create({
        ...spareTypeRelation,
      });
    },

    onUpdate: async (id, values) => {
      const spareTypeRelation = buildRelation(
        "tblSpareType",
        "spareTypeId",
        values.spareTypeId?.spareTypeId,
      );

      return tblSpareUnit.update(id, {
        ...spareTypeRelation,
      });
    },

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
      <Box display="grid" gridTemplateColumns="repeat(1, 1fr)" gap={1.5}>
        <Controller
          name="spareTypeId"
          control={control}
          render={({ field, fieldState }) => (
            <FieldAsyncSelectGrid
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

export default memo(SpareUnitUpsert);
