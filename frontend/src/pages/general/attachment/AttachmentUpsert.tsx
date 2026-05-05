import * as z from "zod";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import FileField from "@/shared/components/fields/FieldFile";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import FieldAsyncSelect from "@/shared/components/fields/FieldAsyncSelect";

import { memo, useEffect } from "react";
import { Controller } from "react-hook-form";
import { useAtomValue } from "jotai";

import { atomUser } from "@/pages/auth/auth.atom";
import {
  tblAttachment,
  tblAttachmentType,
  TypeTblAttachment,
  TypeTblAttachmentType,
} from "@/core/api/generated/api";

import { newAttachmentSchema } from "@/shared/tabs/attachmentMap/AttachmentMapSchema";
import { useUpsertForm } from "@/shared/hooks/useUpsertForm";
import { createAttachment } from "./AttachmentService";

// === Types ===
export type AttachmentFormValues = z.input<typeof newAttachmentSchema>;

const defaultValues: AttachmentFormValues = {
  title: "",
  attachmentType: null,
  isUserAttachment: true,
  file: new File([], ""),
};

function AttachmentUpsert({
  entityName,
  open,
  mode,
  recordId,
  onClose,
  onSuccess,
}: UpsertProps<TypeTblAttachment>) {
  const user = useAtomValue(atomUser);

  const {
    form,
    loadingInitial,
    submitting,
    isDisabled,
    readonly,
    title,
    handleFormSubmit,
  } = useUpsertForm<AttachmentFormValues, TypeTblAttachment>({
    entityName,
    open,
    mode,
    recordId,
    schema: newAttachmentSchema,
    defaultValues,

    onFetch: async (id) => {
      const res = await tblAttachment.getById(id, {
        include: { tblAttachmentType: true },
      });

      return {
        title: res?.title ?? "",
        attachmentType: res?.tblAttachmentType
          ? {
              attachmentTypeId: res.tblAttachmentType.attachmentTypeId,
              name: res.tblAttachmentType.name ?? "",
            }
          : null,
        isUserAttachment: res?.isUserAttachment ?? true,
        file: new File([], ""),
      };
    },

    onCreate: async (values) =>
      createAttachment({
        ...values,
        attachmentTypeId: values.attachmentType?.attachmentTypeId as number,
        createdEmployeeId: user?.tblEmployee?.employeeId as number,
      }),

    onSuccess,
    onClose,
  });

  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = form;

  const selectedFile = watch("file");

  // === Auto title from file ===
  useEffect(() => {
    const fileName = selectedFile?.name?.trim();

    if (!fileName) {
      setValue("title", "");
      return;
    }

    const lastDotIndex = fileName.lastIndexOf(".");
    const nameWithoutExtension =
      lastDotIndex === -1 ? fileName : fileName.substring(0, lastDotIndex);

    const currentTitle = watch("title");

    if (!currentTitle?.trim()) {
      setValue("title", nameWithoutExtension);
    }
  }, [selectedFile]);

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
      <Box display="flex" flexDirection="column" gap={1.5}>
        {/* File */}
        <Controller
          name="file"
          control={control}
          render={({ field: { onChange } }) => (
            <FileField
              label="Attachment File *"
              onChange={onChange}
              error={!!errors.file}
              helperText={errors.file?.message as string}
              disabled={isDisabled || mode === "update"}
              required
              placeholder="Click to upload or drag and drop file"
            />
          )}
        />

        {/* Title */}
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Title *"
              size="small"
              error={!!errors.title}
              helperText={errors.title?.message}
              disabled={isDisabled}
            />
          )}
        />

        <Box display="grid" gridTemplateColumns="2fr 1fr" gap={1.5}>
          {/* Type */}
          <Controller
            name="attachmentType"
            control={control}
            render={({ field, fieldState }) => (
              <FieldAsyncSelect<TypeTblAttachmentType>
                {...field}
                value={field.value}
                onChange={field.onChange}
                label="Attachment Type *"
                request={tblAttachmentType.getAll}
                getOptionLabel={(row) => row.name || ""}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          {/* Checkbox */}
          <Controller
            name="isUserAttachment"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                sx={{ margin: 0 }}
                control={
                  <Checkbox
                    checked={field.value}
                    onChange={field.onChange}
                    disabled={isDisabled}
                  />
                }
                label="User Attachment"
              />
            )}
          />
        </Box>
      </Box>
    </FormDialog>
  );
}

export default memo(AttachmentUpsert);
