import * as z from "zod";
import FieldDateTime from "@/shared/components/fields/FieldDateTime";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import Editor from "@/shared/components/Editor";
import FieldAsyncSelectGrid from "@/shared/components/fields/FieldAsyncSelectGrid";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { memo, useCallback, useEffect, useState } from "react";
import { buildRelation, extractFullName } from "@/core/helper";
import { useAtomValue } from "jotai";
import { atomUser, atomUserDiscipline } from "@/pages/auth/auth.atom";
import { toast } from "sonner";

import {
  tblWorkShop,
  tblEmployee,
  tblComponentUnit,
  TypeTblWorkShop,
  TypeTblEmployee,
  TypeTblComponentUnit,
  tblWorkShopComponent,
} from "@/core/api/generated/api";

// ─────────────────────────────
// Schemas
// ─────────────────────────────

const componentUnitSchema = z
  .object({
    compId: z.number(),
    compNo: z.string().nullable(),
  })
  .nullable()
  .refine((v) => v !== null, {
    message: "Component Unit is required",
  });

const employeeSchema = z
  .object({
    employeeId: z.number(),
    tblDiscipline: z.any().optional(),
  })
  .nullable()
  .refine((v) => v !== null, {
    message: "Person in charge is required",
  });

const employeeApproveSchema = z
  .object({
    employeeId: z.number(),
  })
  .nullable()
  .refine((v) => v !== null, {
    message: "ToolPusher is required",
  });

// ─────────────────────────────
// Main Schema
// ─────────────────────────────

export const schema = z.object({
  componentUnit: componentUnitSchema,

  title: z.string().min(1, "Title is required"),

  personInCharge: employeeSchema,

  personInChargeApprove: employeeApproveSchema,

  workShopNo: z.string().nullable().optional(),
  awardingDate: z.string().nullable().optional(),
  repairDescription: z.string().nullable().optional(),
  followDesc: z.string().nullable().optional(),
});

// ─────────────────────────────
// Types
// ─────────────────────────────

export type SchemaValue = z.input<typeof schema>;

// ─────────────────────────────
// Defaults
// ─────────────────────────────

const DEFAULT_VALUES: SchemaValue = {
  componentUnit: null as any,
  title: "",
  workShopNo: "",
  awardingDate: new Date().toISOString(),
  personInCharge: null as any,
  personInChargeApprove: null as any,
  repairDescription: "",
  followDesc: "",
};

// ─────────────────────────────

const EMPLOYEE_COLUMNS = [
  { field: "firstName", headerName: "First Name", flex: 1 },
  { field: "lastName", headerName: "Last Name", flex: 1 },
];

type Props = {
  open: boolean;
  workShopId?: number | null;
  initialCompId?: number | null;
  onClose: () => void;
  onSuccess: (data: TypeTblWorkShop) => void;
};

// ─────────────────────────────

function WorkShopUpsert({
  open,
  workShopId,
  initialCompId,
  onClose,
  onSuccess,
}: Props) {
  const user = useAtomValue(atomUser);
  const userDiscipline = useAtomValue(atomUserDiscipline);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const mode = workShopId ? "update" : "create";

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SchemaValue>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT_VALUES,
  });

  const personInCharge = watch("personInCharge");
  const discipline = personInCharge?.tblDiscipline ?? userDiscipline;

  // ─────────────────────────────
  // Auto user
  // ─────────────────────────────
  useEffect(() => {
    if (!open || mode !== "create") return;
    if (user?.tblEmployee) {
      setValue("personInCharge", user.tblEmployee);
    }
  }, [open, mode, user, setValue]);

  // ─────────────────────────────
  // Initial component
  // ─────────────────────────────
  useEffect(() => {
    if (!open || mode !== "create" || !initialCompId) return;

    tblComponentUnit
      .getById(initialCompId)
      .then((c) => {
        if (!c) return;
        setValue("componentUnit", {
          compId: c.compId,
          compNo: c.compNo,
        } as any);
      })
      .catch(console.error);
  }, [open, mode, initialCompId, setValue]);

  // ─────────────────────────────
  // Fetch edit data
  // ─────────────────────────────
  const fetchData = useCallback(async () => {
    if (!workShopId) return;

    setLoading(true);

    try {
      const data: any = await tblWorkShop.getById(workShopId, {
        include: {
          tblWorkShopComponents: true,
          tblDiscipline: true,
          tblEmployeeTblWorkShopPersonInChargeIdTotblEmployee: true,
          tblEmployeeTblWorkShopPersonInChargeApproveIdTotblEmployee: true,
        },
      });

      let componentUnit = null;

      const compId = data?.tblWorkShopComponents[0]?.compId;
      if (compId) {
        componentUnit = await tblComponentUnit.getById(compId);
      }

      reset({
        componentUnit: componentUnit
          ? {
              compId: componentUnit.compId,
              compNo: componentUnit.compNo,
            }
          : null,

        title: data.title,
        workShopNo: data.workShopNo ?? "",
        awardingDate: data.awardingDate
          ? new Date(data.awardingDate).toISOString()
          : null,

        repairDescription: data.repairDescription ?? "",
        followDesc: data.followDesc ?? "",

        personInCharge:
          data.tblEmployeeTblWorkShopPersonInChargeIdTotblEmployee ?? null,

        personInChargeApprove:
          data.tblEmployeeTblWorkShopPersonInChargeApproveIdTotblEmployee ??
          null,
      });

      if (!data) return;
    } catch {
      toast.error("Failed to load WorkShop");
    } finally {
      setLoading(false);
    }
  }, [workShopId, reset]);

  useEffect(() => {
    if (open) fetchData();
  }, [open, fetchData]);

  // ─────────────────────────────
  // Submit
  // ─────────────────────────────
  const onSubmit = useCallback(
    async (values: SchemaValue) => {
      setSubmitting(true);

      try {
        const body = {
          title: values.title,
          awardingDate: values.awardingDate
            ? new Date(values.awardingDate).toISOString()
            : null,

          repairDescription: values.repairDescription,
          followDesc: values.followDesc,

          ...(discipline
            ? buildRelation("tblDiscipline", "discId", discipline)
            : {}),

          ...(values.personInCharge
            ? buildRelation(
                "tblEmployeeTblWorkShopPersonInChargeIdTotblEmployee",
                "employeeId",
                values.personInCharge,
              )
            : {}),

          ...(values.personInChargeApprove
            ? buildRelation(
                "tblEmployeeTblWorkShopPersonInChargeApproveIdTotblEmployee",
                "employeeId",
                values.personInChargeApprove,
              )
            : {}),

          ...(values.componentUnit && {
            compId: values.componentUnit.compId,
          }),
        };

        let result;

        if (mode === "create") {
          const created = await tblWorkShop.create(body);
          result = await tblWorkShop.getById(created.workShopId, {
            include: true,
          });
        } else {
          result = await tblWorkShop.update(workShopId!, body, {
            include: true,
          });
        }

        toast.success("Saved successfully");
        onSuccess(result);
        onClose();
      } catch {
        toast.error("Save failed");
      } finally {
        setSubmitting(false);
      }
    },
    [mode, workShopId, discipline, onSuccess, onClose],
  );

  const isDisabled = loading || submitting;

  // ─────────────────────────────
  // UI
  // ─────────────────────────────
  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title={mode === "create" ? "Create WorkShop" : "Edit WorkShop"}
      submitting={submitting}
      loadingInitial={loading}
      maxWidth="lg"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1.5}>
        <Box display={"flex"} flexDirection={"column"} gap={1.5}>
          {/* ⭐ COMPONENT UNIT - بالای همه */}
          <Controller
            name="componentUnit"
            control={control}
            render={({ field }) => (
              <FieldAsyncSelectGrid<TypeTblComponentUnit>
                label="Component Unit *"
                placeholder="Select a component..."
                value={field.value}
                onChange={field.onChange}
                disabled={isDisabled}
                error={!!errors.componentUnit}
                helperText={errors.componentUnit?.message}
                request={tblComponentUnit.getAll}
                columns={[
                  {
                    field: "compNo",
                    headerName: "CompNo",
                    flex: 1,
                  },
                ]}
                getOptionLabel={(row) => row.compNo}
                getRowId={(row) => row?.compId}
              />
            )}
          />
          <Divider />

          <Controller
            name="workShopNo"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="WorkShop No"
                size="small"
                fullWidth
                sx={{ width: "50%" }}
                slotProps={{ input: { readOnly: true } }}
              />
            )}
          />

          <Divider />

          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Title *"
                size="small"
                fullWidth
                error={!!errors.title}
                disabled={isDisabled}
              />
            )}
          />

          <Controller
            name="awardingDate"
            control={control}
            render={({ field }) => (
              <FieldDateTime
                label="Awarding Date *"
                field={field}
                type="DATE"
                disabled={isDisabled}
              />
            )}
          />
          <Divider />

          <Controller
            name="personInChargeApprove"
            control={control}
            render={({ field, fieldState }) => (
              <FieldAsyncSelectGrid<TypeTblEmployee>
                label="ToolPusher *"
                columns={EMPLOYEE_COLUMNS}
                request={tblEmployee.getAll}
                getRowId={(r) => r.employeeId}
                getOptionLabel={extractFullName}
                value={field.value}
                onChange={field.onChange}
                disabled={isDisabled}
                error={!!fieldState.error?.message}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Box display={"flex"} gap={1.5}>
            <Controller
              name="personInCharge"
              control={control}
              render={({ field }) => (
                <FieldAsyncSelectGrid<TypeTblEmployee>
                  label="Person In Charge *"
                  columns={EMPLOYEE_COLUMNS}
                  request={() =>
                    tblEmployee.getAll({
                      include: { tblDiscipline: true },
                    })
                  }
                  getRowId={(r) => r.employeeId}
                  getOptionLabel={extractFullName}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isDisabled}
                />
              )}
            />
            {/* Discipline DISPLAY ONLY */}
            <TextField
              label="Discipline"
              value={discipline?.name ?? ""}
              size="small"
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Box>
        </Box>
        <Editor
          initValue={watch("repairDescription")}
          label="Repair Description"
          onChange={(v) => setValue("repairDescription", v)}
          disabled={isDisabled}
          containerStyle={{ height: 320 }}
        />

        {/* FULL WIDTH */}
        <Box gridColumn="1 / -1">
          <Editor
            initValue={watch("followDesc")}
            label="Follow Description"
            onChange={(v) => setValue("followDesc", v)}
            disabled={isDisabled}
            containerStyle={{ height: 230 }}
          />
        </Box>
      </Box>
    </FormDialog>
  );
}

export default memo(WorkShopUpsert);
