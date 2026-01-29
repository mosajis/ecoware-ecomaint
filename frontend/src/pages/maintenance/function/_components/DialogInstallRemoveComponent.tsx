import * as z from "zod";
import { memo, useCallback, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FieldAsyncSelectGrid from "@/shared/components/fields/FieldAsyncSelectGrid";
import {
  tblComponentUnit,
  tblFunctions,
  tblRotationLog,
} from "@/core/api/generated/api";
import { buildRelation } from "@/core/helper";
import FieldDateTime from "@/shared/components/fields/FieldDateTime";
import { useAtom, useAtomValue } from "jotai";
import { atomUser } from "@/pages/auth/auth.atom";

// =======================
// SCHEMA
// =======================
const installSchema = z.object({
  component: z.object({
    compId: z.number(),
    compNo: z.string(),
  }),
  fromDate: z.date().or(z.string()),
  notes: z.string().nullable().optional(),
});

const removeSchema = z.object({
  toDate: z.date().or(z.string()),
  notes: z.string().nullable().optional(),
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
  const [loading, setloading] = useState(false);
  const schema = mode === "install" ? installSchema : removeSchema;
  const user = useAtomValue(atomUser);
  const userId = user?.userId as number;

  const { control, handleSubmit } = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...(mode === "install"
        ? {
            component: null,
            fromDate: new Date(),
            notes: "",
          }
        : {
            toDate: new Date(),
            notes: "",
          }),
    },
  });

  // =======================
  // SUBMIT
  // =======================
  const onSubmit = useCallback(
    async (values: InstallValues | RemoveValues) => {
      setloading(true);
      if (mode === "install") {
        const v = values as InstallValues;

        // 1. rotation log
        await tblRotationLog.create({
          ...buildRelation("tblFunctions", "functionId", functionId),
          ...buildRelation("tblComponentUnit", "compId", v.component.compId),
          ...buildRelation(
            "tblUsersTblRotationLogUserInsertedIdTotblUsers",
            "userId",
            userId,
          ),
          fromDate: new Date(v.fromDate) as any,
          notes: v.notes ?? "",
        });

        // 2. update function
        await tblFunctions.update(functionId, {
          ...buildRelation("tblComponentUnit", "compId", v.component.compId),
        });

        // 3. update component status → InUse = 2
        await tblComponentUnit.update(v.component.compId, {
          ...buildRelation("tblCompStatus", "compStatusId", 2),
        });
      } else {
        const v = values as RemoveValues;

        await tblRotationLog.create({
          ...buildRelation("tblComponentUnit", "compId", compId),
          ...buildRelation("tblFunctions", "functionId", functionId),
          ...buildRelation(
            "tblUsersTblRotationLogUserRemovedIdTotblUsers",
            "userId",
            userId,
          ),

          toDate: new Date(v.toDate) as any,
          notes: v.notes ?? "",
        });

        // function → null
        await tblFunctions.update(functionId, {
          tblComponentUnit: {
            disconnect: true,
          },
        });

        // component → None = 1
        if (compId) {
          await tblComponentUnit.update(compId, {
            ...buildRelation("tblCompStatus", "compStatusId", 1),
          });
        }
      }
      setloading(false);
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
      loadingInitial={loading}
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
                <FieldAsyncSelectGrid
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
                <DateField
                  field={field}
                  type="DATE"
                  label="From Date"
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
                <DateField
                  field={field}
                  type="DATE"
                  label="To Date"
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
