import * as z from "zod";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import NumberField from "@/shared/components/fields/FieldNumber";
import FieldAsyncSelectGrid from "@/shared/components/fields/FieldAsyncSelectGrid";
import { Controller, useWatch } from "react-hook-form";
import { memo } from "react";

import {
  tblMaintLogSpare,
  tblSpareUnit,
  TypeTblMaintLogSpare,
  TypeTblSpareType,
  TypeTblSpareUnit,
} from "@/core/api/generated/api";

import { useUpsertForm } from "@/shared/hooks/useUpsertForm";

/* ---------------- schema ---------------- */

const schema = z.object({
  spareUnit: z.object({
    spareUnitId: z.number(),
    tblSpareType: z
      .object({
        spareTypeId: z.number(),
        partTypeNo: z.string().nullable().optional(),
        name: z.string().nullable().optional(),
        makerRefNo: z.string().nullable().optional(),
      })
      .nullable()
      .optional(),
  }),

  spareCount: z.number().min(1, "Spare count must be greater than 0"),
});

export type SpareUsedFormValues = z.infer<typeof schema>;

/* ---------------- props ---------------- */

type Props = {
  open: boolean;
  mode: "create" | "update";
  recordId?: number | null;
  maintLogId?: number;
  onClose: () => void;
  onSuccess: (data: TypeTblMaintLogSpare) => void;
};

/* ---------------- component ---------------- */

function TabSpareUsedUpsert({
  entityName,
  open,
  mode,
  recordId,
  maintLogId,
  onClose,
  onSuccess,
}: Props & { entityName?: string }) {
  console.log(maintLogId);
  const {
    form,
    loadingInitial,
    submitting,
    isDisabled,
    title,
    handleFormSubmit,
  } = useUpsertForm<SpareUsedFormValues, TypeTblMaintLogSpare>({
    entityName: entityName ?? "tblMaintLogSpare",
    open,
    mode,
    recordId,
    schema,

    defaultValues: {
      spareUnit: undefined as any,
      spareCount: 1,
    },

    /* ---------------- fetch ---------------- */
    onFetch: async (id) => {
      const res = await tblMaintLogSpare.getById(id, {
        include: {
          tblSpareUnit: {
            include: { tblSpareType: true },
          },
        },
      });

      return {
        spareUnit: res.tblSpareUnit ?? null,
        spareCount: res.spareCount ?? 1,
      };
    },

    /* ---------------- create ---------------- */
    onCreate: async (values) => {
      if (!maintLogId) throw new Error("maintLogId is required");

      return tblMaintLogSpare.create({
        spareCount: values.spareCount,
        tblSpareUnit: {
          connect: {
            spareUnitId: values.spareUnit.spareUnitId,
          },
        },
        tblMaintLog: {
          connect: {
            maintLogId: maintLogId,
          },
        },
      });
    },

    /* ---------------- update ---------------- */
    onUpdate: async (id, values) => {
      if (!maintLogId) throw new Error("maintLogId is required");

      return tblMaintLogSpare.update(id, {
        spareCount: values.spareCount,
        tblSpareUnit: {
          connect: {
            spareUnitId: values.spareUnit.spareUnitId,
          },
        },
        tblMaintLog: {
          connect: {
            maintLogId: maintLogId,
          },
        },
      });
    },

    onSuccess,
    onClose,
  });

  const { control } = form;

  const selectedSpare = useWatch({
    control,
    name: "spareUnit",
  });

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title={title}
      submitting={submitting}
      loadingInitial={loadingInitial}
      onSubmit={handleFormSubmit}
    >
      <Box display="grid" gap={1.5}>
        {/* Spare Unit */}
        <Controller
          name="spareUnit"
          control={control}
          render={({ field, fieldState }) => (
            <FieldAsyncSelectGrid<TypeTblSpareUnit>
              dialogMaxWidth="sm"
              label="Spare Item *"
              selectionMode="single"
              value={field.value}
              onChange={field.onChange}
              disabled={isDisabled}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              getRowId={(row) => row.spareUnitId}
              getOptionLabel={(row) => row?.tblSpareType?.name ?? ""}
              request={() =>
                tblSpareUnit.getAll({
                  include: { tblSpareType: true },
                  filter: {
                    NOT: {
                      tblMaintLogSpares: {
                        some: { maintLogId },
                      },
                    },
                  },
                })
              }
              columns={[
                {
                  field: "name",
                  headerName: "Part Name",
                  flex: 1,
                  //@ts-ignore
                  valueGetter: (_, row) => row?.tblSpareType?.name,
                },
                {
                  field: "partTypeNo",
                  headerName: "MESC Code",
                  flex: 1,
                  //@ts-ignore
                  valueGetter: (_, row) => row?.tblSpareType?.partTypeNo,
                },
                {
                  field: "makerRefNo",
                  headerName: "Maker Ref",
                  flex: 1,
                  //@ts-ignore
                  valueGetter: (_, row) => row?.tblSpareType?.makerRefNo,
                },
              ]}
            />
          )}
        />

        {/* MESC Code */}
        <TextField
          label="MESC Code"
          size="small"
          value={selectedSpare?.tblSpareType?.partTypeNo ?? ""}
          slotProps={{ input: { readOnly: true } }}
        />

        {/* Spare Count */}
        <Controller
          name="spareCount"
          control={control}
          render={({ field, fieldState }) => (
            <NumberField
              {...field}
              label="Spare Count *"
              size="small"
              value={field.value}
              onChange={field.onChange}
              disabled={isDisabled}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
      </Box>
    </FormDialog>
  );
}

export default memo(TabSpareUsedUpsert);
