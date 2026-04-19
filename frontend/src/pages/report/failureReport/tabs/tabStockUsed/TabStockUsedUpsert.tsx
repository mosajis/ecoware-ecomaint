// StepStockUsedUpsert.tsx - استفاده از کد ارسالی با تغییر atom
import * as z from "zod";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import NumberField from "@/shared/components/fields/FieldNumber";
import FieldAsyncSelectGrid from "@/shared/components/fields/FieldAsyncSelectGrid";
import { useForm, Controller } from "react-hook-form";
import { memo, useEffect, useState, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  tblMaintLogStocks,
  tblSpareUnit,
  TypeTblMaintLogStocks,
} from "@/core/api/generated/api";

const schema = z.object({
  spareUnit: z.object({
    spareUnitId: z.number(),
    tblSpareType: z
      .object({
        spareTypeId: z.number(),
        partTypeNo: z.string().nullable().optional(),
        name: z.string().nullable().optional(),
      })
      .nullable()
      .optional(),
  }),
  stockCount: z.number().min(1, "Stock count must be greater than 0"),
});

export type StockUsedFormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  mode: "create" | "update";
  recordId?: number | null;
  maintLogId?: number;
  onClose: () => void;
  onSuccess: (data: TypeTblMaintLogStocks) => void;
};

function StepStockUsedUpsert({
  open,
  mode,
  recordId,
  maintLogId,
  onClose,
  onSuccess,
}: Props) {
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const defaultValues: StockUsedFormValues = {
    spareUnit: undefined as any,
    stockCount: 1,
  };

  const { control, handleSubmit, reset, watch } = useForm<StockUsedFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const selectedSpare = watch("spareUnit");

  const fetchData = useCallback(async () => {
    if (mode !== "update" || !recordId) {
      reset(defaultValues);
      return;
    }

    setLoadingInitial(true);

    try {
      const res = await tblMaintLogStocks.getById(recordId, {
        include: {
          tblSpareUnit: {
            include: { tblSpareType: true },
          },
        },
      });

      if (res?.tblSpareUnit) {
        reset({
          spareUnit: res.tblSpareUnit,
          stockCount: res.stockCount ?? 1,
        });
      }
    } finally {
      setLoadingInitial(false);
    }
  }, [mode, recordId, reset]);

  useEffect(() => {
    if (open) fetchData();
  }, [open, fetchData]);

  const isDisabled = loadingInitial || submitting;

  const handleFormSubmit = useCallback(
    async (values: StockUsedFormValues) => {
      if (!maintLogId) {
        console.error("maintLogId is required");
        return;
      }

      try {
        setSubmitting(true);

        const payload = {
          stockCount: values.stockCount,
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
        };

        let result: TypeTblMaintLogStocks;

        if (mode === "create") {
          result = await tblMaintLogStocks.create(payload);
        } else {
          result = await tblMaintLogStocks.update(recordId!, payload);
        }

        onSuccess(result);
        onClose();
      } finally {
        setSubmitting(false);
      }
    },
    [mode, recordId, maintLogId, onSuccess, onClose],
  );

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title={mode === "create" ? "Add Stock Used" : "Edit Stock Used"}
      submitting={submitting}
      loadingInitial={loadingInitial}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <Box display="grid" gap={1.5}>
        <Controller
          name="spareUnit"
          control={control}
          render={({ field, fieldState }) => (
            <FieldAsyncSelectGrid
              dialogMaxWidth="sm"
              label="Stock Item *"
              selectionMode="single"
              getOptionLabel={(row) => row?.tblSpareType?.name}
              value={field.value}
              request={() =>
                tblSpareUnit.getAll({
                  include: { tblSpareType: true },
                  filter: {
                    NOT: {
                      tblMaintLogStocks: {
                        some: { maintLogId },
                      },
                    },
                  },
                })
              }
              columns={[
                {
                  field: "partName",
                  headerName: "Part Name",
                  flex: 1,
                  // @ts-ignore
                  valueGetter: (_, row) => row?.tblSpareType?.name,
                },
                {
                  field: "partTypeNo",
                  headerName: "MESC Code",
                  flex: 1,
                  // @ts-ignore
                  valueGetter: (_, row) => row?.tblSpareType?.partTypeNo,
                },
                {
                  field: "makerRefNo",
                  headerName: "Maker Ref",
                  flex: 1,
                  // @ts-ignore
                  valueGetter: (_, row) => row?.tblSpareType?.makerRefNo,
                },
              ]}
              getRowId={(row) => row.spareUnitId}
              onChange={field.onChange}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              disabled={isDisabled}
            />
          )}
        />

        <TextField
          label="MESC Code"
          size="small"
          value={selectedSpare?.tblSpareType?.partTypeNo ?? ""}
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
        />

        <Controller
          name="stockCount"
          control={control}
          render={({ field, fieldState }) => (
            <NumberField
              {...field}
              label="Stock Count *"
              size="small"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              disabled={isDisabled}
              value={field.value}
              onChange={(value) => field.onChange(value)}
            />
          )}
        />
      </Box>
    </FormDialog>
  );
}

export default memo(StepStockUsedUpsert);
