import * as z from "zod";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import FieldAsyncSelect from "@/shared/components/fields/FieldAsyncSelect";
import FieldAsyncSelectGrid from "@/shared/components/fields/FieldAsyncSelectGrid";
import { memo, useEffect, useMemo, useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  tblUser,
  tblEmployee,
  TypeTblUser,
  tblUserGroup,
} from "@/core/api/generated/api";

// === Validation Schema with Zod ===
const schema = z.object({
  userName: z.string(),
  password: z.string(),
  accountDisabled: z.boolean(),
  forcePasswordChange: z.boolean(),

  tblEmployee: z
    .object({
      employeeId: z.number(),
    })
    .nullable()
    .optional(),

  tblUserGroup: z
    .object({
      userGroupId: z.number(),
    })
    .nullable()
    .optional(),
});

export type UserFormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  mode: "create" | "update";
  recordId?: number | null;
  onClose: () => void;
  onSuccess?: (data: TypeTblUser) => void;
};

function UserUpsert({ open, mode, recordId, onClose, onSuccess }: Props) {
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const defaultValues: UserFormValues = useMemo(
    () => ({
      userName: "",
      password: "",
      accountDisabled: false,
      forcePasswordChange: false,
      employeeId: null,
      userGroupId: null,
    }),
    [],
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // === Fetch initial data for update mode
  const fetchData = useCallback(async () => {
    if (mode === "update" && recordId) {
      setLoadingInitial(true);
      try {
        const res = await tblUser.getById(recordId, {
          include: {
            tblEmployee: true,
            tblUserGroup: true,
          },
        });
        if (res) {
          reset({
            userName: res.userName ?? "",
            password: "",
            accountDisabled: res.accountDisabled ?? false,
            forcePasswordChange: res.forcePasswordChange ?? false,
            tblEmployee: res.tblEmployee,
            tblUserGroup: res.tblUserGroup,
          });
        }
      } catch (err) {
        console.error("Failed to load user", err);
      } finally {
        setLoadingInitial(false);
      }
    } else {
      reset(defaultValues);
    }
  }, [mode, recordId, reset, defaultValues]);

  useEffect(() => {
    if (open) fetchData();
  }, [open, fetchData]);

  const isDisabled = loadingInitial || submitting;

  // === Form submit handler
  const handleFormSubmit = useCallback(
    async (values: UserFormValues) => {
      setSubmitting(true);
      try {
        // ساخت شیء ورودی مناسب برای API
        const inputData: any = {
          userName: values.userName ?? "", // تبدیل به string
          password: values.password ? values.password : undefined, // در update اختیاری
          accountDisabled: values.accountDisabled ?? false,
          forcePasswordChange: values.forcePasswordChange ?? false,
          employeeId: values.tblEmployee?.employeeId ?? null,
          userGroupId: values.tblUserGroup?.userGroupId ?? null,
        };

        // در حالت update، اگر پسورد خالی است، حذفش کن
        if (mode === "update" && !inputData.password) {
          delete inputData.password;
        }

        let result: any;

        if (mode === "create") {
          result = await tblUser.create(inputData);
        } else if (mode === "update" && recordId) {
          result = await tblUser.update(recordId, inputData);
        }

        if (result) {
          onSuccess?.(result);
          onClose();
        }
      } catch (err) {
        toast.error("Failed to submit user form");
      } finally {
        setSubmitting(false);
      }
    },
    [mode, recordId, onSuccess, onClose],
  );

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title={mode === "create" ? "Create User" : "Edit User"}
      submitting={submitting}
      loadingInitial={loadingInitial}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={1.5}>
        {/* UserName */}
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

        {/* Password (only enabled in create mode, in update it's optional) */}
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={
                mode === "create"
                  ? "Password *"
                  : "New Password (leave empty to keep)"
              }
              type="password"
              size="small"
              error={!!errors.password}
              helperText={errors.password?.message}
              disabled={isDisabled}
            />
          )}
        />

        {/* Employee (AsyncSelect) */}
        <Controller
          name="tblEmployee"
          control={control}
          render={({ field }) => (
            <FieldAsyncSelectGrid
              columns={[
                { field: "code", headerName: "Code", width: 60 },
                { field: "lastName", headerName: "Last Name", flex: 1 },
                { field: "firstName", headerName: "First Name", flex: 1 },
              ]}
              label="Employee"
              disabled={isDisabled}
              error={!!errors.tblEmployee}
              helperText={errors.tblEmployee?.message}
              request={() =>
                tblEmployee.getAll({
                  filter: {
                    tblUsers: {
                      none: {},
                    },
                  },
                })
              }
              getOptionLabel={(row: any) => `${row.firstName} ${row.lastName}`}
              getRowId={(row: any) => row.employeeId}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        {/* UserGroup (AsyncSelect) */}
        <Controller
          name="tblUserGroup"
          control={control}
          render={({ field }) => (
            <FieldAsyncSelect
              label="User Group"
              placeholder="Select user group"
              disabled={isDisabled}
              error={!!errors.tblUserGroup}
              helperText={errors.tblUserGroup?.message}
              request={(query) => tblUserGroup.getAll(query)}
              getOptionLabel={(row: any) => row.name}
              getOptionKey={(row: any) => row.userGroupId}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        <Box display={"flex"} gap={1.5} flexDirection={"column"}>
          <Controller
            name="accountDisabled"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch
                    checked={field.value}
                    onChange={field.onChange}
                    disabled={isDisabled}
                  />
                }
                label="Account Disabled"
              />
            )}
          />

          {/* <Controller
            name="forcePasswordChange"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch
                    checked={field.value}
                    onChange={field.onChange}
                    disabled={isDisabled}
                  />
                }
                label="Force Password Change"
              />
            )}
          /> */}
        </Box>
      </Box>
    </FormDialog>
  );
}

export default memo(UserUpsert);
