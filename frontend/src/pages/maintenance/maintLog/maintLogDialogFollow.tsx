import * as z from "zod";
import Box from "@mui/material/Box";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import { memo, useCallback, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  tblFollowStatus,
  TypeTblFollowStatus,
  tblMaintLog,
  tblMaintLogFollow,
} from "@/core/api/generated/api";
import FieldAsyncSelect from "@/shared/components/fields/FieldAsyncSelect";
import Editor from "@/shared/components/Editor";
import { buildRelation } from "@/core/helper";
import { useAtomValue } from "jotai";
import { atomUser } from "@/pages/auth/auth.atom";

const schema = z.object({
  followStatus: z
    .object({
      followStatusId: z.number(),
      fsName: z.string().optional().nullable(),
    })
    .nullable()
    .refine((val) => val !== null, { message: "Follow status is required" }),
  description: z.string().nullable().optional(),
});

type MaintLogFollowFormValues = z.input<typeof schema>;

interface Props {
  open: boolean;
  maintLogId: number;
  onClose: () => void;
  onSuccess?: (followStatus: TypeTblFollowStatus) => void;
}

function MaintLogFollowDialog({ open, maintLogId, onClose, onSuccess }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const user = useAtomValue(atomUser);
  const userId = user?.userId as number;

  const defaultValues: MaintLogFollowFormValues = {
    followStatus: null,
    description: "",
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<MaintLogFollowFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onChange",
  });

  // Reset form when dialog is opened
  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, reset]);

  const onSubmit = useCallback(
    async (values: MaintLogFollowFormValues) => {
      if (!isValid) return;

      setSubmitting(true);

      try {
        const followStatus = values.followStatus!;
        const followStatusId = followStatus.followStatusId;

        // 1. Update follow status on the main maintenance log record
        await tblMaintLog.update(maintLogId, {
          ...buildRelation("tblFollowStatus", "followStatusId", followStatusId),
        });

        // 2. Create follow-up log entry
        await tblMaintLogFollow.create({
          ...buildRelation("tblUsers", "userId", userId),
          ...buildRelation("tblMaintLog", "maintLogId", maintLogId),
          ...buildRelation("tblFollowStatus", "followStatusId", followStatusId),
          followDesc: values.description,
        } as any);

        // Trigger optimistic update in parent
        onSuccess?.(followStatus as any);

        onClose();
      } catch (err) {
        console.error("Failed to save follow-up:", err);
      } finally {
        setSubmitting(false);
      }
    },
    [maintLogId, onClose, onSuccess, isValid],
  );

  const isDisabled = submitting;

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title="Add New Follow-up"
      submitting={submitting}
      onSubmit={handleSubmit(onSubmit)}
      disabled={!isValid || isDisabled}
    >
      <Box display="flex" flexDirection="column" gap={3} mt={1}>
        {/* Follow Status */}
        <Controller
          name="followStatus"
          control={control}
          render={({ field, fieldState }) => (
            <FieldAsyncSelect<TypeTblFollowStatus>
              label="Follow Status *"
              placeholder="Select follow status..."
              selectionMode="single"
              value={field.value}
              request={tblFollowStatus.getAll}
              getOptionLabel={(row) => row.fsName || "Unnamed"}
              getOptionKey={(row) => row.followStatusId}
              onChange={field.onChange}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              disabled={isDisabled}
              minCharsToSearch={0}
            />
          )}
        />

        {/* Description */}
        <Controller
          name="description"
          control={control}
          render={({ field, fieldState }) => (
            <Editor
              containerStyle={{ height: 200 }}
              label="Description *"
              initValue={field.value ?? ""}
              onChange={field.onChange}
              placeholder="Enter follow-up details, actions taken, outcome, notes..."
              disabled={isDisabled}
              autoSave={false}
            />
          )}
        />
      </Box>
    </FormDialog>
  );
}

export default memo(MaintLogFollowDialog);
