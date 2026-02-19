import * as z from "zod";
import Box from "@mui/material/Box";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import FieldAsyncSelectGrid from "@/shared/components/fields/FieldAsyncSelectGrid";
import { memo, useEffect, useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  tblComponentUnit,
  tblWorkShopComponent,
  TypeTblComponentUnit,
  TypeTblWorkShopComponent,
} from "@/core/api/generated/api";

const schema = z.object({
  component: z
    .object({
      compId: z.number(),
      compNo: z.string().nullable(),
      tblLocation: z
        .object({
          locationId: z.number().nullable(),
          name: z.string().nullable(),
        })
        .nullable(),
      serialNo: z.string().nullable(),
    })
    .nullable()
    .refine((val) => val, {
      message: "Component is required",
    }),
});

type FormValues = z.input<typeof schema>;

type Props = {
  open: boolean;
  workShopId: number;
  onClose: () => void;
  onSuccess: (data: TypeTblWorkShopComponent) => void;
};

function TabComponentUpsert({ open, workShopId, onClose, onSuccess }: Props) {
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      component: null,
    },
  });

  /**
   * Reset form when dialog opens
   */
  useEffect(() => {
    if (open) {
      reset({ component: null });
    }
  }, [open, reset]);

  /**
   * Submit
   */
  const handleFormSubmit = useCallback(
    async (values: FormValues) => {
      const parsed = schema.safeParse(values);
      if (!parsed.success) return;

      const component = parsed.data.component!;
      try {
        setSubmitting(true);

        const result = await tblWorkShopComponent.create({
          tblWorkShop: {
            connect: { workShopId },
          },
          tblComponentUnit: {
            connect: { compId: component.compId },
          },

          // ✅ فقط اگر location وجود داشت
          ...(component.tblLocation?.locationId && {
            tblLocation: {
              connect: {
                locationId: component.tblLocation.locationId,
              },
            },
          }),
        });

        onSuccess(result);
        onClose();
      } finally {
        setSubmitting(false);
      }
    },
    [workShopId, onSuccess, onClose],
  );

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title="Add Component"
      submitting={submitting}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <Box display="grid" gap={1.5}>
        <Controller
          name="component"
          control={control}
          render={({ field, fieldState }) => (
            <FieldAsyncSelectGrid<TypeTblComponentUnit>
              label="Component *"
              selectionMode="single"
              value={field.value}
              request={() =>
                tblComponentUnit.getAll({
                  include: { tblLocation: true },
                  filter: {
                    NOT: {
                      tblWorkShopComponents: {
                        some: { workShopId },
                      },
                    },
                  },
                })
              }
              columns={[{ field: "compNo", headerName: "Comp No", flex: 1 }]}
              getRowId={(row) => row.compId}
              getOptionLabel={(row) => row.compNo ?? ""}
              onChange={field.onChange}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              disabled={submitting}
            />
          )}
        />
      </Box>
    </FormDialog>
  );
}

export default memo(TabComponentUpsert);
