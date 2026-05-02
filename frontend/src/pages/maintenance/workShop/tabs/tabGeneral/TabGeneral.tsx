import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Editor from "@/shared/components/Editor";
import FieldDateTime from "@/shared/components/fields/FieldDateTime";
import FieldAsyncSelectGrid from "@/shared/components/fields/FieldAsyncSelectGrid";
import FieldAsyncSelect from "@/shared/components/fields/FieldAsyncSelect";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { memo, useCallback, useEffect } from "react";
import { schema, DEFAULT_VALUES, SchemaValue } from "./TabGeneralSchema";
import { buildRelation } from "@/core/helper";
import { useAtom, useAtomValue } from "jotai";
import { atomUserDiscipline } from "@/pages/auth/auth.atom";
import { atomInitData } from "../../WorkShopAtom";
import { toast } from "sonner";
import {
  tblWorkShop,
  tblDiscipline,
  tblUser,
  TypeTblDiscipline,
} from "@/core/api/generated/api";

type Props = {
  mode: "create" | "update";
  workShopId?: number | null;
};

function TabGeneral({ mode, workShopId }: Props) {
  const userDiscipline = useAtomValue(atomUserDiscipline);

  const [initData, setInitData] = useAtom(atomInitData);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<SchemaValue>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...DEFAULT_VALUES,
      discipline: userDiscipline,
    },
  });

  /* -------------------------------------------------- */
  /* Populate form in update mode */
  /* -------------------------------------------------- */
  useEffect(() => {
    const { workShop } = initData;
    if (!workShop) return;

    reset({
      title: workShop.title,
      workShopNo: workShop.workShopNo ?? "",
      awardingDate: workShop.awardingDate?.toString(),
      discipline: workShop.tblDiscipline ?? null,
      personInCharge:
        workShop?.tblUsersTblWorkShopPersonInChargeIdTotblUsers ?? null,
      personInChargeApprove:
        workShop?.tblUsersTblWorkShopPersonInChargeApproveIdTotblUsers ?? null,
      repairDescription: workShop.repairDescription ?? "",
      followDesc: workShop.followDesc ?? "",
    });
  }, [initData, reset]);

  const handleFormSubmit = useCallback(
    async (values: SchemaValue) => {
      const parsed = schema.safeParse(values);
      if (!parsed.success) return;

      const v = parsed.data;

      try {
        const body = {
          title: v.title,
          workShopNo: v.workShopNo,
          awardingDate: v.awardingDate?.toString(),
          repairDescription: v.repairDescription,
          followDesc: v.followDesc,
          ...buildRelation(
            "tblDiscipline",
            "discId",
            v.discipline?.discId ?? userDiscipline.discId ?? null,
          ),
          ...buildRelation(
            "tblUsersTblWorkShopPersonInChargeIdTotblUsers",
            "userId",
            v.personInCharge?.userId,
          ),
          ...buildRelation(
            "tblUsersTblWorkShopPersonInChargeApproveIdTotblUsers",
            "userId",
            v.personInChargeApprove?.userId,
          ),
        };

        if (mode === "create") {
          const result = await tblWorkShop.count();
          const nextNumber = ((result?.count ?? 0) + 1).toString();
          const created = await tblWorkShop.create({
            ...body,
            workShopNo: nextNumber,
            createdDate: new Date().toString(),
          });
          const record = await tblWorkShop.getById(created.workShopId, {
            include: {
              tblDiscipline: true,
              tblUsersTblWorkShopPersonInChargeIdTotblUsers: {
                include: {
                  tblEmployeeTblUsersEmployeeIdTotblEmployee: true,
                },
              },
              tblUsersTblWorkShopPersonInChargeApproveIdTotblUsers: {
                include: {
                  tblEmployeeTblUsersEmployeeIdTotblEmployee: true,
                },
              },
              tblUsersTblWorkShopClosedByIdTotblUsers: {
                include: {
                  tblEmployeeTblUsersEmployeeIdTotblEmployee: true,
                },
              },
            },
          });
          setInitData({ workShop: record });
        } else {
          const updated = await tblWorkShop.update(workShopId!, body, {
            include: {
              tblDiscipline: true,
              tblUsersTblWorkShopPersonInChargeIdTotblUsers: {
                include: {
                  tblEmployeeTblUsersEmployeeIdTotblEmployee: true,
                },
              },
              tblUsersTblWorkShopPersonInChargeApproveIdTotblUsers: {
                include: {
                  tblEmployeeTblUsersEmployeeIdTotblEmployee: true,
                },
              },
              tblUsersTblWorkShopClosedByIdTotblUsers: {
                include: {
                  tblEmployeeTblUsersEmployeeIdTotblEmployee: true,
                },
              },
            },
          });
          setInitData({ workShop: updated });
        }

        toast.success("WorkShop saved");
      } catch {
        toast.error("Error saving WorkShop");
      }
    },
    [mode, workShopId, setInitData],
  );

  const isDisabled = isSubmitting;

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleFormSubmit)}
      display="flex"
      flexDirection="column"
      gap={1.5}
      p={1}
    >
      {/* Row 1 */}
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
            />
          )}
        />
        <Controller
          name="workShopNo"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="WorkShop No *"
              fullWidth
              size="small"
              error={!!errors.workShopNo}
              InputProps={{ readOnly: true }}
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

      <Box display={"flex"} gap={1.5}>
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
            <FieldAsyncSelectGrid
              label="Person In Charge"
              columns={[
                {
                  field: "firstName",
                  headerName: "First Name",
                  flex: 1,
                  valueGetter: (_: any, row: any) =>
                    row?.tblEmployeeTblUsersEmployeeIdTotblEmployee?.firstName,
                },
                {
                  field: "lastName",
                  headerName: "Last Name",
                  flex: 1,
                  valueGetter: (_: any, row: any) =>
                    row?.tblEmployeeTblUsersEmployeeIdTotblEmployee?.lastName,
                },
              ]}
              request={() =>
                tblUser.getAll({
                  include: {
                    tblEmployeeTblUsersEmployeeIdTotblEmployee: true,
                  },
                })
              }
              getRowId={(row) => row.userId}
              getOptionLabel={(row) =>
                row?.tblEmployeeTblUsersEmployeeIdTotblEmployee?.firstName +
                " " +
                row?.tblEmployeeTblUsersEmployeeIdTotblEmployee?.lastName
              }
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
            <FieldAsyncSelectGrid
              label="ToolPusher"
              columns={[
                {
                  field: "firstName",
                  headerName: "First Name",
                  flex: 1,
                  valueGetter: (_: any, row: any) =>
                    row?.tblEmployeeTblUsersEmployeeIdTotblEmployee?.firstName,
                },
                {
                  field: "lastName",
                  headerName: "Last Name",
                  flex: 1,
                  valueGetter: (_: any, row: any) =>
                    row?.tblEmployeeTblUsersEmployeeIdTotblEmployee?.lastName,
                },
              ]}
              request={() =>
                tblUser.getAll({
                  include: {
                    tblEmployeeTblUsersEmployeeIdTotblEmployee: true,
                  },
                })
              }
              getRowId={(row) => row.userId}
              getOptionLabel={(row) =>
                row?.tblEmployeeTblUsersEmployeeIdTotblEmployee?.firstName +
                " " +
                row?.tblEmployeeTblUsersEmployeeIdTotblEmployee?.lastName
              }
              value={field.value}
              onChange={field.onChange}
              disabled={isDisabled}
            />
          )}
        />
      </Box>

      {/* Row 3 */}
      <Box display="flex" flexDirection={"column"} gap={1.5} height="470px">
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

      <Button
        type="submit"
        variant="outlined"
        color="secondary"
        style={{ margin: "auto", width: 408 }}
        disabled={isDisabled || !isDirty}
      >
        {isSubmitting ? "Saving..." : "Save General"}
      </Button>
    </Box>
  );
}

export default memo(TabGeneral);
