import * as z from "zod";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import Editor from "@/shared/components/Editor";
import FieldDateTime from "@/shared/components/fields/FieldDateTime";
import FieldAsyncSelectGrid from "@/shared/components/fields/FieldAsyncSelectGrid";
import FieldAsyncSelect from "@/shared/components/fields/FieldAsyncSelect";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { memo, useCallback, useEffect, useState } from "react";
import {
  buildRelation,
  extractFullName,
  requiredStringField,
} from "@/core/helper";
import { useAtomValue } from "jotai";
import { atomUserDiscipline } from "@/pages/auth/auth.atom";
import { toast } from "sonner";
import {
  tblWorkShop,
  tblDiscipline,
  tblUser,
  TypeTblDiscipline,
  TypeTblWorkShop,
  tblEmployee,
  TypeTblEmployee,
} from "@/core/api/generated/api";

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  title: requiredStringField(),
  workShopNo: z.string().nullable(),
  awardingDate: z.string().nullable(),
  discipline: z.any().nullable(),
  personInCharge: z.any().nullable(),
  personInChargeApprove: z.any().nullable(),
  repairDescription: z.string().nullable(),
  followDesc: z.string().nullable(),
});

type SchemaValue = z.infer<typeof schema>;

const DEFAULT_VALUES: SchemaValue = {
  title: "",
  workShopNo: "",
  awardingDate: null,
  discipline: null,
  personInCharge: null,
  personInChargeApprove: null,
  repairDescription: "",
  followDesc: "",
};

// ─── Shared include query ─────────────────────────────────────────────────────

const INCLUDE = {
  tblDiscipline: true,
  tblEmployeeTblWorkShopPersonInChargeIdTotblEmployee: true,
  tblEmployeeTblWorkShopPersonInChargeApproveIdTotblEmployee: true,
} as const;

// ─── User columns helper ──────────────────────────────────────────────────────

const EMPLOYEE_COLUMNS = [
  {
    field: "firstName",
    headerName: "First Name",
    flex: 1,
  },
  {
    field: "lastName",
    headerName: "Last Name",
    flex: 1,
  },
];

// ─── Props ────────────────────────────────────────────────────────────────────

type Props = {
  open: boolean;
  workShopId?: number | null;
  onClose: () => void;
  onSuccess: (data: TypeTblWorkShop) => void;
};

// ─── Component ────────────────────────────────────────────────────────────────

function WorkShopUpsert({ open, workShopId, onClose, onSuccess }: Props) {
  const userDiscipline = useAtomValue(atomUserDiscipline);

  const [loadingInitial, setLoadingInitial] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const mode: "create" | "update" = workShopId ? "update" : "create";

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<SchemaValue>({
    resolver: zodResolver(schema),
    defaultValues: { ...DEFAULT_VALUES, discipline: userDiscipline },
  });

  // ── Fetch ─────────────────────────────────────────────────────────────────

  const fetchData = useCallback(async () => {
    if (mode === "update" && workShopId) {
      setLoadingInitial(true);
      try {
        const workShop = await tblWorkShop.getById(workShopId, {
          include: INCLUDE,
        });
        if (workShop) {
          reset({
            title: workShop.title,
            workShopNo: workShop.workShopNo ?? "",
            awardingDate: workShop.awardingDate?.toString(),
            discipline: workShop.tblDiscipline ?? null,
            personInCharge:
              workShop.tblEmployeeTblWorkShopPersonInChargeIdTotblEmployee ??
              null,
            personInChargeApprove:
              workShop.tblEmployeeTblWorkShopPersonInChargeApproveIdTotblEmployee ??
              null,
            repairDescription: workShop.repairDescription ?? "",
            followDesc: workShop.followDesc ?? "",
          });
        }
      } catch {
        toast.error("Failed to load WorkShop");
      } finally {
        setLoadingInitial(false);
      }
    } else {
      reset({ ...DEFAULT_VALUES, discipline: userDiscipline });
    }
  }, [mode, workShopId, reset, userDiscipline]);

  useEffect(() => {
    if (open) fetchData();
  }, [open, fetchData]);

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleFormSubmit = useCallback(
    async (values: SchemaValue) => {
      setSubmitting(true);
      try {
        const body = {
          title: values.title,
          workShopNo: values.workShopNo,
          awardingDate: values.awardingDate?.toString(),
          repairDescription: values.repairDescription,
          followDesc: values.followDesc,
          ...buildRelation(
            "tblDiscipline",
            "discId",
            values.discipline?.discId ?? userDiscipline.discId ?? null,
          ),
          ...buildRelation(
            "tblEmployeeTblWorkShopPersonInChargeApproveIdTotblEmployee",
            "employeeId",
            values.personInChargeApprove?.employeeId,
          ),
          ...buildRelation(
            "tblEmployeeTblWorkShopPersonInChargeIdTotblEmployee",
            "employeeId",
            values.personInCharge?.employeeId,
          ),
        };

        let result: TypeTblWorkShop;

        if (mode === "create") {
          const countResult = await tblWorkShop.count();
          const nextNumber = ((countResult?.count ?? 0) + 1).toString();
          const created = await tblWorkShop.create({
            ...body,
            workShopNo: nextNumber,
            createdDate: new Date().toString(),
          });
          result = await tblWorkShop.getById(created.workShopId, {
            include: INCLUDE,
          });
        } else {
          result = await tblWorkShop.update(workShopId!, body, {
            include: INCLUDE,
          });
        }

        toast.success("WorkShop saved");
        onSuccess(result);
        onClose();
      } catch {
        toast.error("Error saving WorkShop");
      } finally {
        setSubmitting(false);
      }
    },
    [mode, workShopId, userDiscipline, onSuccess, onClose],
  );

  // ── Render ────────────────────────────────────────────────────────────────

  const isDisabled = loadingInitial || submitting;

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title={mode === "create" ? "Create WorkShop" : "Edit WorkShop"}
      submitting={submitting}
      loadingInitial={loadingInitial}
      maxWidth="lg"
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <Box display="flex" flexDirection="column" gap={1.5} p={1}>
        {/* Row 1 – Title / No / Date */}
        <Box display="flex" gap={1.5}>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Title *"
                fullWidth
                size="small"
                error={!!errors.title}
                disabled={isDisabled}
              />
            )}
          />

          <Controller
            name="workShopNo"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="WorkShop No"
                fullWidth
                size="small"
                InputProps={{ readOnly: true }}
                disabled={isDisabled}
              />
            )}
          />

          <Controller
            name="awardingDate"
            control={control}
            render={({ field }) => (
              <FieldDateTime
                label="Awarding Date"
                field={field}
                disabled={isDisabled}
                type="DATE"
                error={!!errors.awardingDate}
              />
            )}
          />
        </Box>

        {/* Row 2 – Selects */}
        <Box display="flex" gap={1.5}>
          <Controller
            name="discipline"
            control={control}
            render={({ field }) => (
              <FieldAsyncSelect<TypeTblDiscipline>
                label="Discipline"
                getOptionKey={(row) => row.discId}
                getOptionLabel={(row) => row.name || ""}
                request={tblDiscipline.getAll}
                value={field.value}
                onChange={field.onChange}
                disabled={isDisabled || mode === "create"}
              />
            )}
          />

          <Controller
            name="personInCharge"
            control={control}
            render={({ field }) => (
              <FieldAsyncSelectGrid<TypeTblEmployee>
                label="Person In Charge"
                columns={EMPLOYEE_COLUMNS}
                request={tblEmployee.getAll}
                getRowId={(row) => row.employeeId}
                getOptionLabel={extractFullName}
                value={field.value}
                onChange={field.onChange}
                disabled={isDisabled}
              />
            )}
          />

          <Controller
            name="personInChargeApprove"
            control={control}
            render={({ field }) => (
              <FieldAsyncSelectGrid<TypeTblEmployee>
                label="ToolPusher"
                columns={EMPLOYEE_COLUMNS}
                request={tblEmployee.getAll}
                getRowId={(row) => row.employeeId}
                getOptionLabel={extractFullName}
                value={field.value}
                onChange={field.onChange}
                disabled={isDisabled}
              />
            )}
          />
        </Box>

        {/* Row 3 – Editors */}
        <Box display="flex" flexDirection="column" gap={1.5} height="470px">
          <Controller
            name="repairDescription"
            control={control}
            render={({ field }) => (
              <Editor
                {...field}
                initValue={field.value}
                label="Repair Description"
                onChange={field.onChange}
                disabled={isDisabled}
                autoSave={false}
              />
            )}
          />

          <Controller
            name="followDesc"
            control={control}
            render={({ field }) => (
              <Editor
                {...field}
                initValue={field.value}
                label="Follow Description"
                onChange={field.onChange}
                disabled={isDisabled}
                autoSave={false}
              />
            )}
          />
        </Box>
      </Box>
    </FormDialog>
  );
}

export default memo(WorkShopUpsert);
