import * as z from "zod";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import NumberField from "@/shared/components/fields/FieldNumber";
import { useForm, Controller } from "react-hook-form";
import { memo, useEffect, useState, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AsyncSelectGridField } from "@/shared/components/fields/FieldAsyncSelectGrid";
import { buildRelation } from "@/core/helper";
import {
  tblMaintLogStocks,
  tblSpareUnit,
  TypeTblMaintLogStocks,
} from "@/core/api/generated/api";

// === Validation Schema ===
const schema = z.object({
  spareUnit: z
    .object({
      spareUnitId: z.number(),
      tblSpareType: z
        .object({
          spareTypeId: z.number(),
          no: z.string().nullable().optional(),
          name: z.string().nullable().optional(),
        })
        .nullable()
        .optional(),
    })
    .nullable(),
  stockNo: z.string().nullable().optional(),
  stockName: z.string().nullable().optional(),
  stockCount: z.number().min(0, "Stock count must be greater than 0"),
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

function StockUsedFormDialog({
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
    spareUnit: null,
    stockNo: null,
    stockName: null,
    stockCount: 0,
  };

  const { control, handleSubmit, reset, watch } = useForm<StockUsedFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const stockItemValue = watch("spareUnit");

  // === Load record in edit mode ===
  const fetchData = useCallback(async () => {
    if (mode !== "update" || !recordId) {
      reset(defaultValues);
      return;
    }

    setLoadingInitial(true);

    try {
      const res = await tblMaintLogStocks.getById(recordId, {
        include: {
          tblStockItem: {
            include: {
              tblSpareType: true,
            },
          },
        },
      });

      if (res?.tblSpareUnit) {
        reset({
          spareUnit: res.tblSpareUnit,
          // @ts-ignore
          stockNo: res.tblStockItem?.tblSpareType?.no ?? null,
          // @ts-ignore

          stockName: res.tblStockItem?.tblSpareType?.name ?? null,
          stockCount: res.stockCount ?? 0,
        });
      } else {
        reset(defaultValues);
      }
    } finally {
      setLoadingInitial(false);
    }
  }, [mode, recordId, reset]);

  useEffect(() => {
    if (open) fetchData();
  }, [open, fetchData]);

  // === Update stock display when stock item changes ===
  useEffect(() => {
    if (stockItemValue?.tblSpareType) {
      // نمایش اطلاعات stock بر اساس انتخاب شده
    }
  }, [stockItemValue]);

  const isDisabled = loadingInitial || submitting;

  // === Submit Handler ===
  const handleFormSubmit = useCallback(
    async (values: StockUsedFormValues) => {
      const parsed = schema.safeParse(values);
      if (!parsed.success) return;

      try {
        setSubmitting(true);

        let result: TypeTblMaintLogStocks;

        const stockItemId = parsed.data.spareUnit?.spareUnitId ?? null;
        const stockItemRelation = buildRelation(
          "tblSpareUnit",
          "spareUnitId",
          stockItemId,
        );

        const maintLogRelation = buildRelation(
          "tblMaintLog",
          "maintLogId",
          maintLogId,
        );

        if (mode === "create") {
          // POST Request
          result = await tblMaintLogStocks.create({
            stockCount: parsed.data.stockCount,
            ...stockItemRelation,
            ...maintLogRelation,
          });
        } else {
          // PUT Request
          result = await tblMaintLogStocks.update(recordId!, {
            stockCount: parsed.data.stockCount,
            ...stockItemRelation,
            ...maintLogRelation,
          });
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
      <Box display="grid" gridTemplateColumns="repeat(1, 1fr)" gap={1.5}>
        {/* Stock Item Select - Required */}
        <Controller
          name="spareUnit"
          control={control}
          rules={{
            required: "Stock Item is required",
          }}
          render={({ field, fieldState }) => (
            <AsyncSelectGridField
              dialogMaxWidth="sm"
              label="Stock Item *"
              selectionMode="single"
              value={field.value}
              request={() =>
                tblSpareUnit.getAll({
                  include: { tblSpareType: true },
                })
              }
              columns={[
                {
                  field: "stockItemId",
                  headerName: "Stock Item ID",
                  width: 120,
                },
                {
                  field: "tblSpareType",
                  headerName: "Stock Type",
                  flex: 1,
                  // @ts-ignore
                  valueGetter: (_, row) => row?.tblSpareType?.name,
                },
              ]}
              getRowId={(row) => row.stockItemId}
              onChange={field.onChange}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              disabled={isDisabled}
            />
          )}
        />

        {/* Stock No - Read Only */}
        <Controller
          name="stockNo"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Stock No"
              size="small"
              disabled={true}
              value={stockItemValue?.tblSpareType?.no || ""}
            />
          )}
        />

        {/* Stock Name - Read Only */}
        <Controller
          name="stockName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Stock Name"
              size="small"
              disabled={true}
              value={stockItemValue?.tblSpareType?.name || ""}
            />
          )}
        />

        {/* Stock Count - Required */}
        <Controller
          name="stockCount"
          control={control}
          rules={{
            required: "Stock count is required",
          }}
          render={({ field, fieldState }) => (
            <NumberField
              {...field}
              label="Stock Count *"
              size="small"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              disabled={isDisabled}
              value={field.value ?? 0}
              onChange={(value) => field.onChange(value)}
            />
          )}
        />
      </Box>
    </FormDialog>
  );
}

export default memo(StockUsedFormDialog);
