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
import { atomUser, atomUserDiscipline } from "@/pages/auth/auth.atom";
import { toast } from "sonner";
import { Divider } from "@mui/material";
import {
  tblWorkShop,
  TypeTblWorkShop,
  tblEmployee,
  TypeTblEmployee,
  tblComponentUnit,
  TypeTblComponentUnit,
} from "@/core/api/generated/api";

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  componentUnit: z
    .object({
      compId: z.number(),
      compNo: z.string().nullable(),
    })
    .nullable()
    .refine((val) => val !== null, {
      message: "Component Unit is required",
    }),
  title: requiredStringField(),
  workShopNo: z.string().nullable(),
  awardingDate: z.string().nullable(),
  personInCharge: z.any().nullable(),
  personInChargeApprove: z.any().nullable(),
  repairDescription: z.string().nullable(),
  followDesc: z.string().nullable(),
});

type SchemaValue = z.input<typeof schema>;

const DEFAULT_VALUES: SchemaValue = {
  componentUnit: null,
  title: "",
  workShopNo: "",
  awardingDate: new Date().toString(),
  personInCharge: undefined,
  personInChargeApprove: undefined,
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
  initialCompId?: number | null; // ⭐ compId اختیاری
  onClose: () => void;
  onSuccess: (data: TypeTblWorkShop) => void;
};

// ─── Component ────────────────────────────────────────────────────────────────

function WorkShopUpsert({
  open,
  workShopId,
  initialCompId,
  onClose,
  onSuccess,
}: Props) {
  const user = useAtomValue(atomUser);
  const userDiscipline = useAtomValue(atomUserDiscipline);

  const [loadingInitial, setLoadingInitial] = useState(false);
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
  const componentUnit = watch("componentUnit");

  // ─────────────────────────────
  // Derived state (NO FORM FIELD)
  // ─────────────────────────────
  const discipline = personInCharge?.tblDiscipline ?? userDiscipline;

  // ─────────────────────────────
  // auto set default user
  // ─────────────────────────────
  useEffect(() => {
    if (!open || mode !== "create") return;

    if (user?.tblEmployee) {
      setValue("personInCharge", user.tblEmployee);
    }
  }, [open, mode, user, setValue]);

  // ─────────────────────────────
  // auto set initial component
  // ─────────────────────────────
  useEffect(() => {
    if (!open || mode !== "create" || !initialCompId) return;

    // 📌 Fetch component data
    const setComponent = async () => {
      try {
        const component = await tblComponentUnit.getById(initialCompId);
        if (component) {
          setValue("componentUnit", {
            compId: component.compId,
            compNo: component.compNo,
          });
        }
      } catch (error) {
        console.error("Failed to load component:", error);
      }
    };

    setComponent();
  }, [open, mode, initialCompId, setValue]);

  // ─────────────────────────────
  // fetch data
  // ─────────────────────────────
  const fetchData = useCallback(async () => {
    if (!workShopId) return;

    setLoadingInitial(true);

    try {
      const data: any = await tblWorkShop.getById(workShopId, {
        include: {
          ...INCLUDE,
          tblWorkShopComponents: {
            include: {
              tblComponentUnit: true,
            },
          },
        },
      });

      if (!data) return;

      // 📌 گرفتن اولین component اگر وجود داشت
      const firstCompId = data.tblWorkShopComponents?.[0]?.compId;

      let componentUnit = null;

      if (firstCompId) {
        try {
          const component = await tblComponentUnit.getById(firstCompId);

          if (component) {
            componentUnit = {
              compId: component.compId,
              compNo: component.compNo,
            };
          }
        } catch (e) {
          console.error("Failed to fetch component unit:", e);
        }
      }
      reset({
        componentUnit,
        title: data.title,
        workShopNo: data.workShopNo ?? "",
        awardingDate: data.awardingDate?.toString(),
        repairDescription: data.repairDescription ?? "",
        followDesc: data.followDesc ?? "",
        personInCharge:
          data.tblEmployeeTblWorkShopPersonInChargeIdTotblEmployee ?? null,
        personInChargeApprove:
          data.tblEmployeeTblWorkShopPersonInChargeApproveIdTotblEmployee ??
          null,
      });
    } catch {
      toast.error("Failed to load WorkShop");
    } finally {
      setLoadingInitial(false);
    }
  }, [workShopId, reset]);

  useEffect(() => {
    if (open) fetchData();
  }, [open, fetchData]);

  // ─────────────────────────────
  // submit
  // ─────────────────────────────
  const onSubmit = useCallback(
    async (values: SchemaValue) => {
      setSubmitting(true);

      try {
        const body = {
          title: values.title,
          // ⭐ workShopNo حذف شد - backend خودش تولید می‌کند
          awardingDate: values.awardingDate?.toString(),
          repairDescription: values.repairDescription,
          followDesc: values.followDesc,

          ...buildRelation("tblDiscipline", "discId", discipline),

          ...buildRelation(
            "tblEmployeeTblWorkShopPersonInChargeIdTotblEmployee",
            "employeeId",
            values.personInCharge,
          ),

          ...buildRelation(
            "tblEmployeeTblWorkShopPersonInChargeApproveIdTotblEmployee",
            "employeeId",
            values.personInChargeApprove,
          ),

          // ⭐ اضافه کردن compId برای ایجاد WorkShopComponent
          ...(values.componentUnit && {
            compId: values.componentUnit.compId,
          }),
        };

        let result: TypeTblWorkShop;

        if (mode === "create") {
          // ⭐ backend خودش workShopNo و createdDate رو تولید می‌کند
          const created = await tblWorkShop.create(body);

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
    [mode, workShopId, discipline, onSuccess, onClose],
  );

  const isDisabled = loadingInitial || submitting;

  // ─────────────────────────────
  // UI
  // ─────────────────────────────
  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title={mode === "create" ? "Create WorkShop" : "Edit WorkShop"}
      submitting={submitting}
      loadingInitial={loadingInitial}
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
