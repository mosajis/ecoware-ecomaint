import * as z from "zod";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

import FormDialog from "@/shared/components/formDialog/FormDialog";
import FieldAsyncSelect from "@/shared/components/fields/FieldAsyncSelect";
import FieldAsyncSelectGrid from "@/shared/components/fields/FieldAsyncSelectGrid";

import { memo } from "react";
import { Controller } from "react-hook-form";

import {
  tblUser,
  tblEmployee,
  tblUserGroup,
  tblUserInstallation,
  tblInstallation,
  TypeTblUserGroup,
  TypeTblEmployee,
} from "@/core/api/generated/api";

import {
  buildRelation,
  extractFullName,
  requiredStringField,
} from "@/core/helper";
import { useUpsertForm } from "@/shared/hooks/useUpsertForm";

/* =======================
   Schema Builder
======================= */

const createSchema = (mode: "create" | "update" | "view") =>
  z.object({
    userName: requiredStringField(),

    password:
      mode === "create"
        ? z.string().min(1, "Password is required")
        : z.string(),

    accountDisabled: z.boolean(),

    forcePasswordChange: z.boolean(),

    tblEmployee: z
      .object({
        employeeId: z.number(),
      })
      .nullable()
      .refine((v) => v !== null, {
        message: "Employee is required",
      }),

    tblUserGroup: z
      .object({
        userGroupId: z.number(),
      })
      .nullable()
      .refine((v) => v !== null, {
        message: "User Group is required",
      }),

    tblUserInstallations: z
      .array(
        z.object({
          instId: z.number(),
        }),
      )
      .min(1, "Select at least one well"),
  });

type UserFormValues = z.input<ReturnType<typeof createSchema>>;

/* =======================
   Default Values
======================= */

const defaultValues: UserFormValues = {
  userName: "",
  password: "",
  accountDisabled: false,
  forcePasswordChange: false,
  tblEmployee: null,
  tblUserGroup: null,
  tblUserInstallations: [],
};

/* =======================
   Component
======================= */

function UserUpsert({
  entityName,
  open,
  mode,
  recordId,
  onClose,
  onSuccess,
}: UpsertProps) {
  const schema = createSchema(mode);

  const {
    form,
    loadingInitial,
    submitting,
    isDisabled,
    readonly,
    title,
    handleFormSubmit,
  } = useUpsertForm({
    entityName,
    open,
    mode,
    recordId,
    schema,
    defaultValues,

    onFetch: async (id) => {
      const userRes = await tblUser.getById(id, {
        include: {
          tblEmployee: true,
          tblUserGroup: true,
        },
      });

      const userInstallRes = await tblUserInstallation.getAll({
        filter: {
          userId: userRes.userId,
        },
        include: {
          tblInstallation: true,
        },
      });

      return {
        userName: userRes.userName ?? "",
        password: "",
        accountDisabled: userRes.accountDisabled ?? false,
        forcePasswordChange: userRes.forcePasswordChange ?? false,
        tblEmployee: userRes.tblEmployee,
        tblUserGroup: userRes.tblUserGroup,
        tblUserInstallations:
          userInstallRes.items.map((x) => ({
            instId: x.instId,
            name: x.tblInstallation?.name,
          })) ?? [],
      };
    },

    onCreate: async (values) => {
      const createdUser = await tblUser.create({
        userName: values.userName,
        password: values.password,
        accountDisabled: values.accountDisabled,
        forcePasswordChange: false,
        employeeId: values.tblEmployee!.employeeId,
        userGroupId: values.tblUserGroup!.userGroupId,
      });

      for (const inst of values.tblUserInstallations) {
        await tblUserInstallation.create({
          tblInstallation: {
            connect: { instId: inst.instId },
          },
          tblUser: {
            connect: { userId: createdUser.userId },
          },
        });
      }

      return createdUser;
    },

    onUpdate: async (id, values) => {
      const payload: any = {
        userName: values.userName,
        accountDisabled: values.accountDisabled,
        forcePasswordChange: false,
        ...buildRelation("tblEmployee", "employeeId", values.tblEmployee),
        ...buildRelation("tblUserGroup", "userGroupId", values.tblUserGroup),
      };

      if (values.password) {
        payload.password = values.password;
      }

      const updatedUser = await tblUser.update(id, payload);

      const currentUser = await tblUser.getById(id, {
        include: {
          tblUserInstallations: true,
        },
      });

      const currentIds =
        currentUser.tblUserInstallations?.map((x) => x.instId) ?? [];
      const desiredIds = values.tblUserInstallations.map((x) => x.instId);

      const toAdd = desiredIds.filter((x) => !currentIds.includes(x));
      const toRemove = currentIds.filter((x) => !desiredIds.includes(x));

      for (const instId of toAdd) {
        await tblUserInstallation.create({
          tblInstallation: {
            connect: { instId },
          },
          tblUser: {
            connect: { userId: id },
          },
        });
      }

      for (const instId of toRemove) {
        await tblUserInstallation.deleteAll({
          filter: { userId: id, instId },
        });
      }

      return updatedUser;
    },

    onSuccess,
    onClose,
  });

  const {
    control,
    formState: { errors },
  } = form;

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title={title}
      submitting={submitting}
      loadingInitial={loadingInitial}
      onSubmit={handleFormSubmit}
      readonly={readonly}
    >
      <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={1.5}>
        <Controller
          name="userName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Username *"
              size="small"
              error={!!errors.userName}
              helperText={errors.userName?.message}
              disabled={isDisabled}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={mode === "create" ? "Password *" : "New Password"}
              type="password"
              size="small"
              error={!!errors.password}
              helperText={errors.password?.message}
              disabled={isDisabled}
            />
          )}
        />

        <Controller
          name="tblEmployee"
          control={control}
          render={({ field }) => (
            <FieldAsyncSelectGrid<TypeTblEmployee>
              label="Employee *"
              columns={[
                { field: "firstName", headerName: "First Name", flex: 1 },
                { field: "lastName", headerName: "Last Name", flex: 1 },
              ]}
              disabled={isDisabled}
              error={!!errors.tblEmployee}
              helperText={errors.tblEmployee?.message}
              request={tblEmployee.getAll}
              getOptionLabel={extractFullName}
              getRowId={(row) => row.employeeId}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        <Controller
          name="tblUserGroup"
          control={control}
          render={({ field }) => (
            <FieldAsyncSelect<TypeTblUserGroup>
              label="User Group *"
              disabled={isDisabled}
              error={!!errors.tblUserGroup}
              helperText={errors.tblUserGroup?.message}
              request={tblUserGroup.getAll}
              getOptionLabel={(row) => row.name}
              getOptionKey={(row) => row.userGroupId}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        <Box gridColumn="span 2">
          <Controller
            name="accountDisabled"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                label="Account Disabled"
                control={
                  <Switch
                    checked={field.value}
                    onChange={field.onChange}
                    disabled={isDisabled}
                  />
                }
              />
            )}
          />
        </Box>

        <Box gridColumn="span 2">
          <Controller
            name="tblUserInstallations"
            control={control}
            render={({ field }) => (
              <FieldAsyncSelectGrid
                label="Rig Access *"
                columns={[
                  { field: "name", headerName: "Name", flex: 1 },
                  { field: "caption", headerName: "Caption", flex: 1 },
                ]}
                disabled={isDisabled}
                error={!!errors.tblUserInstallations}
                helperText={errors.tblUserInstallations?.message}
                request={tblInstallation.getAll}
                selectionMode="multiple"
                getOptionLabel={(row) => row.name}
                getRowId={(row) => row.instId}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </Box>
      </Box>
    </FormDialog>
  );
}

export default memo(UserUpsert);
