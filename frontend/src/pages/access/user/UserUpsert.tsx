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
  tblUserInstallation,
  tblInstallation,
  TypeTblUserGroup,
} from "@/core/api/generated/api";

type Props = {
  open: boolean;
  mode: "create" | "update";
  recordId?: number | null;
  onClose: () => void;
  onSuccess?: (data: TypeTblUser) => void;
};

// Helper function to create schema based on mode
const createValidationSchema = (mode: "create" | "update") =>
  z.object({
    userName: z.string().min(1, "Username is required"),
    password: z.string().refine(
      (val) => {
        if (mode === "create") return val.length > 0;
        return true; // Update mode: password is optional
      },
      {
        message: "Password is required",
      },
    ),
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

    tblUserInstallations: z
      .array(
        z.object({
          instId: z.number(),
        }),
      )
      .min(1, "Select at least one well"),
  });

export type UserFormValues = z.infer<ReturnType<typeof createValidationSchema>>;

function UserUpsert({ open, mode, recordId, onClose, onSuccess }: Props) {
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validationSchema = useMemo(() => createValidationSchema(mode), [mode]);

  const defaultValues: UserFormValues = useMemo(
    () => ({
      userName: "",
      password: "",
      accountDisabled: false,
      forcePasswordChange: false,
      tblEmployee: null,
      tblUserGroup: null,
      tblUserInstallations: [],
    }),
    [],
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues,
    mode: "onChange",
  });

  // === Fetch initial data for update mode
  const fetchData = useCallback(async () => {
    if (mode === "update" && recordId) {
      setLoadingInitial(true);
      try {
        // Fetch user details
        const userRes = await tblUser.getById(recordId, {
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

        if (userRes && userInstallRes) {
          // Extract installation IDs for the form
          const userInstallations =
            userInstallRes.items.map((ui) => ({
              instId: ui.instId,
              name: ui?.tblInstallation?.name,
            })) || [];

          reset({
            userName: userRes.userName ?? "",
            password: "",
            accountDisabled: userRes.accountDisabled ?? false,
            forcePasswordChange: userRes.forcePasswordChange ?? false,
            tblEmployee: userRes.tblEmployee,
            tblUserGroup: userRes.tblUserGroup,
            tblUserInstallations: userInstallations,
          });
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        toast.error("Failed to load user data");
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

  const handleFormSubmit = useCallback(
    async (values: UserFormValues) => {
      setSubmitting(true);
      try {
        const userData: any = {
          userName: values.userName ?? "",
          accountDisabled: values.accountDisabled ?? false,
          forcePasswordChange: false,
          employeeId: values.tblEmployee?.employeeId || null,
          userGroupId: values.tblUserGroup?.userGroupId || null,
        };

        // Handle password properly
        if (mode === "create") {
          userData.password = values.password;
        } else if (values.password) {
          // Update mode: only include password if user provided one
          userData.password = values.password;
        }

        let createdOrUpdatedUser: any;

        // Handle user creation/update
        if (mode === "create") {
          createdOrUpdatedUser = await tblUser.create(userData);
          toast.success("User created successfully.");
        } else if (mode === "update" && recordId) {
          createdOrUpdatedUser = await tblUser.update(recordId, userData);
          toast.success("User updated successfully.");
        }

        // After user is created/updated, handle installations
        if (createdOrUpdatedUser) {
          const userId = createdOrUpdatedUser.userId as number;
          const desiredInstallationIds =
            values.tblUserInstallations?.map((inst) => inst.instId) || [];

          // For create mode: just add all desired installations
          if (mode === "create") {
            for (const instId of desiredInstallationIds) {
              await tblUserInstallation.create({
                tblInstallation: {
                  connect: {
                    instId,
                  },
                },
                tblUser: {
                  connect: {
                    userId,
                  },
                },
              });
            }
          } else if (mode === "update") {
            // For update mode: delete old ones and create new ones
            // Get current installations
            const currentUserInstallations = await tblUser.getById(userId, {
              include: {
                tblUserInstallations: true,
              },
            });

            const currentInstallationIds =
              currentUserInstallations?.tblUserInstallations?.map(
                (ui) => ui.instId,
              ) || [];

            // Determine which to add and remove
            const installationsToAdd = desiredInstallationIds.filter(
              (id) => !currentInstallationIds.includes(id),
            );
            const installationsToRemove = currentInstallationIds.filter(
              (id) => !desiredInstallationIds.includes(id),
            );

            // Add new installations
            for (const instId of installationsToAdd) {
              await tblUserInstallation.create({
                tblInstallation: {
                  connect: {
                    instId,
                  },
                },
                tblUser: {
                  connect: {
                    userId,
                  },
                },
              });
            }

            // Remove old installations
            for (const instId of installationsToRemove) {
              await tblUserInstallation.deleteAll({
                filter: {
                  userId,
                  instId,
                },
              });
            }
          }

          if (desiredInstallationIds.length > 0) {
            toast.success("User wells access updated.");
          }

          onSuccess?.(createdOrUpdatedUser);
          onClose();
        }
      } catch (err: any) {
        console.error("Failed to submit user form", err);
        toast.error(
          err.message || "Failed to submit user form. Please try again.",
        );
      } finally {
        setSubmitting(false);
      }
    },
    [mode, recordId, onSuccess, onClose],
  );

  // === Component for selecting multiple installations ===
  const renderInstallationSelector = useCallback(() => {
    return (
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
            value={field.value || []}
            onChange={field.onChange}
          />
        )}
      />
    );
  }, [control, isDisabled, errors]);

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title={mode === "create" ? "Create User" : "Edit User"}
      submitting={submitting}
      loadingInitial={loadingInitial}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 1.5,
        }}
      >
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

        {/* Password */}
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

        {/* Employee (AsyncSelectGrid) */}
        <Controller
          name="tblEmployee"
          control={control}
          render={({ field }) => (
            <FieldAsyncSelectGrid
              columns={[
                { field: "firstName", headerName: "First Name", flex: 1 },
                { field: "lastName", headerName: "Last Name", flex: 1 },
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
              onChange={(selectedOption) =>
                field.onChange(
                  selectedOption
                    ? { employeeId: selectedOption.employeeId }
                    : null,
                )
              }
            />
          )}
        />

        {/* UserGroup (AsyncSelect) */}
        <Controller
          name="tblUserGroup"
          control={control}
          render={({ field }) => (
            <FieldAsyncSelect<TypeTblUserGroup>
              label="User Group"
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

        {/* Account Disabled */}
        <Box
          display={"flex"}
          gap={1.5}
          flexDirection={"column"}
          gridColumn="span 2"
        >
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
        </Box>

        {/* Wells Access */}
        <Box gridColumn="span 2">{renderInstallationSelector()}</Box>
      </Box>
    </FormDialog>
  );
}

export default memo(UserUpsert);
