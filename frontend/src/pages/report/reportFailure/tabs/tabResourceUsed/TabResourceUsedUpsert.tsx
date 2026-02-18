import * as z from "zod";
import Box from "@mui/material/Box";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import FieldAsyncSelectGrid from "@/shared/components/fields/FieldAsyncSelectGrid";
import NumberField from "@/shared/components/fields/FieldNumber";
import TextField from "@mui/material/TextField";
import { memo, useEffect, useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { buildRelation } from "@/core/helper";
import { useAtomValue } from "jotai";
import { atomInitData } from "../../FailureReportAtom";
import {
  tblEmployee,
  tblLogDiscipline,
  TypeTblEmployee,
  TypeTblLogDiscipline,
} from "@/core/api/generated/api";

const schema = z.object({
  employee: z.custom<TypeTblEmployee>().nullable(),
  disipline: z
    .object({
      discId: z.number(),
      name: z.string().nullable().optional(),
    })
    .nullable(),
  timeSpent: z.number().min(0, "Time spent must be greater than 0"),
});

export type StepResourceUsedFormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  mode: "create" | "update";
  recordId?: number | null;
  onClose: () => void;
  onSuccess: (data: TypeTblLogDiscipline) => void;
};

function TabResourceUsedUpsert({
  open,
  mode,
  recordId,
  onClose,
  onSuccess,
}: Props) {
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { maintLog } = useAtomValue(atomInitData);

  const maintLogId = maintLog?.maintLogId;

  const defaultValues: StepResourceUsedFormValues = {
    employee: null,
    disipline: null,
    timeSpent: 0,
  };

  const { control, handleSubmit, reset, setValue } =
    useForm<StepResourceUsedFormValues>({
      resolver: zodResolver(schema),
      defaultValues,
    });

  const isDisabled = loadingInitial || submitting;

  const fetchData = useCallback(async () => {
    if (mode !== "update" || !recordId) {
      reset(defaultValues);
      return;
    }

    setLoadingInitial(true);

    try {
      const res = await tblLogDiscipline.getById(recordId, {
        include: {
          tblEmployee: true,
          tblDiscipline: true,
        },
      });

      reset({
        employee: res.tblEmployee ?? null,
        disipline: res.tblDiscipline ?? null,
        timeSpent: res.timeSpent ?? 0,
      });
    } finally {
      setLoadingInitial(false);
    }
  }, [mode, recordId, reset]);

  useEffect(() => {
    if (open) fetchData();
  }, [open, fetchData]);

  const handleFormSubmit = useCallback(
    async (values: StepResourceUsedFormValues) => {
      const parsed = schema.safeParse(values);
      if (!parsed.success || !maintLogId) return;

      try {
        setSubmitting(true);

        const employeeRelation = buildRelation(
          "tblEmployee",
          "employeeId",
          parsed.data.employee?.employeeId ?? null,
        );

        const disciplineRelation = buildRelation(
          "tblDiscipline",
          "discId",
          parsed.data.disipline?.discId ?? null,
        );

        const maintLogRelation = buildRelation(
          "tblMaintLog",
          "maintLogId",
          maintLogId,
        );

        let result: TypeTblLogDiscipline;

        if (mode === "create") {
          result = await tblLogDiscipline.create({
            timeSpent: parsed.data.timeSpent,
            ...employeeRelation,
            ...disciplineRelation,
            ...maintLogRelation,
          });
        } else {
          result = await tblLogDiscipline.update(recordId!, {
            timeSpent: parsed.data.timeSpent,
            ...employeeRelation,
            ...disciplineRelation,
            ...maintLogRelation,
          });
        }

        onSuccess(result);
        onClose();
      } finally {
        setSubmitting(false);
      }
    },
    [mode, recordId, maintLogId, onClose, onSuccess],
  );

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title={
        mode === "create"
          ? "Create Step Resource Used"
          : "Edit Step Resource Used"
      }
      submitting={submitting}
      loadingInitial={loadingInitial}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <Box display="grid" gridTemplateColumns="1fr" gap={1.5}>
        <Controller
          name="employee"
          control={control}
          rules={{ required: "Employee is required" }}
          render={({ field, fieldState }) => (
            <FieldAsyncSelectGrid<TypeTblEmployee>
              dialogMaxWidth="sm"
              label="Employee *"
              selectionMode="single"
              value={field.value}
              getOptionLabel={(row) => row.firstName + " " + row.lastName}
              request={() =>
                tblEmployee.getAll({
                  include: { tblDiscipline: true },
                  filter: {
                    NOT: {
                      tblLogDisciplines: {
                        some: { maintLogId },
                      },
                    },
                  },
                })
              }
              columns={[
                { field: "firstName", headerName: "First Name", flex: 1 },
                { field: "lastName", headerName: "Last Name", flex: 1 },
              ]}
              getRowId={(row) => row.employeeId}
              onChange={(value) => {
                field.onChange(value);
                setValue(
                  "disipline",
                  value?.tblDiscipline
                    ? {
                        discId: value.tblDiscipline.discId,
                        name: value.tblDiscipline.name,
                      }
                    : null,
                );
              }}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              disabled={isDisabled}
            />
          )}
        />

        <Controller
          name="disipline"
          control={control}
          render={({ field }) => (
            <TextField
              label="Discipline"
              size="small"
              disabled
              value={field.value?.name ?? ""}
            />
          )}
        />

        <Controller
          name="timeSpent"
          control={control}
          rules={{ required: "Time spent is required" }}
          render={({ field, fieldState }) => (
            <NumberField
              {...field}
              label="Time Spent (Minutes) *"
              size="small"
              value={field.value ?? 0}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              disabled={isDisabled}
              onChange={(value) => field.onChange(value)}
            />
          )}
        />
      </Box>
    </FormDialog>
  );
}

export default memo(TabResourceUsedUpsert);
