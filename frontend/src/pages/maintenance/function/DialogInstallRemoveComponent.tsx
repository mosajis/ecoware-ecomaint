import * as z from "zod";
import { memo, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { AsyncSelectField } from "@/shared/components/AsyncSelectField";
import {
  tblComponentUnit,
  tblFunctions,
  tblRotationLog,
} from "@/core/api/generated/api";
import { buildRelation } from "@/core/helper";

// =======================
// SCHEMA
// =======================
const installSchema = z.object({
  component: z.object({
    compId: z.number(),
    compNo: z.string(),
  }),
  fromDate: z.string().min(1, "From date is required"),
  notes: z.string().nullable().optional(),
});

const removeSchema = z.object({
  toDate: z.string().min(1, "To date is required"),
  notes: z.string().min(1, "Notes is required"),
});

type InstallValues = z.infer<typeof installSchema>;
type RemoveValues = z.infer<typeof removeSchema>;

type Props = {
  open: boolean;
  mode: "install" | "remove";
  functionId: number;
  compId?: number | null;
  onClose: () => void;
  onSuccess: () => void;
};

function DialogInstallRemoveComponent({
  open,
  mode,
  functionId,
  compId,
  onClose,
  onSuccess,
}: Props) {
  const schema = mode === "install" ? installSchema : removeSchema;

  const { control, handleSubmit } = useForm<any>({
    resolver: zodResolver(schema),
  });

  // =======================
  // SUBMIT
  // =======================
  const onSubmit = useCallback(
    async (values: InstallValues | RemoveValues) => {
      if (mode === "install") {
        const v = values as InstallValues;

        // 1. rotation log
        await tblRotationLog.create({
          ...buildRelation("tblFunctions", "functionId", functionId),
          ...buildRelation("tblComponentUnit", "compId", v.component.compId),

          fromDate: new Date(v.fromDate) as any,
          notes: v.notes ?? "",
        });

        // 2. update function
        await tblFunctions.update(functionId, {
          ...buildRelation("tblComponentUnit", "compId", v.component.compId),
        });

        // 3. update component status → InUse = 2
        await tblComponentUnit.update(v.component.compId, {
          ...buildRelation("tblCompStatus", "statusId", 2),
        });
      } else {
        const v = values as RemoveValues;

        await tblRotationLog.create({
          ...buildRelation("tblFunctions", "functionId", functionId),

          toDate: new Date(v.toDate) as any,
          notes: v.notes ?? "",
        });

        // function → null
        await tblFunctions.update(functionId, {
          ...buildRelation("tblComponentUnit", "compId", null),
        });

        // component → None = 1
        if (compId) {
          await tblComponentUnit.update(compId, {
            ...buildRelation("tblCompStatus", "statusId", 1),
          });
        }
      }
      onSuccess();
      onClose();
    },
    [mode, functionId, compId, onClose, onSuccess],
  );

  // =======================
  // RENDER
  // =======================
  return (
    <FormDialog
      open={open}
      title={mode === "install" ? "Install Component" : "Remove Component"}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Box display="flex" flexDirection="column" gap={1.5}>
        {mode === "install" && (
          <>
            <Controller
              name="component"
              control={control}
              render={({ field, fieldState }) => (
                <AsyncSelectField
                  columns={[{ field: "compNo", headerName: "Name", flex: 1 }]}
                  label="Component"
                  selectionMode="single"
                  request={() =>
                    tblComponentUnit.getAll({
                      filter: { statusId: 1 }, // None only
                    })
                  }
                  getOptionLabel={(r) => r.compNo}
                  getRowId={(r) => r.compId}
                  value={field.value}
                  onChange={field.onChange}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="fromDate"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  type="date"
                  size="small"
                  label="From Date"
                  InputLabelProps={{ shrink: true }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Notes" size="small" multiline />
              )}
            />
          </>
        )}

        {mode === "remove" && (
          <>
            <Controller
              name="toDate"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  type="date"
                  size="small"
                  label="To Date"
                  InputLabelProps={{ shrink: true }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="notes"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Notes"
                  size="small"
                  multiline
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </>
        )}
      </Box>
    </FormDialog>
  );
}

export default memo(DialogInstallRemoveComponent);
