import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import FileField from "@/shared/components/fields/FieldFile";
import AsyncSelect from "@/shared/components/fields/FieldAsyncSelectGrid";
import Checkbox from "@mui/material/Checkbox";
import { memo } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { tblAttachmentType } from "@/core/api/generated/api";
import { NewAttachmentFormValues } from "../AttachmentType";
import TabContainer from "@/shared/components/TabContainer";
import FieldAsyncSelect from "@/shared/components/fields/FieldAsyncSelect";

interface NewAttachmentTabProps {
  form: UseFormReturn<NewAttachmentFormValues>;
  disabled: boolean;
}

function NewAttachmentTab({ form, disabled }: NewAttachmentTabProps) {
  return (
    <TabContainer>
      <Box display={"flex"} gap={1.5} flexDirection={"column"} p={1.5}>
        <Controller
          name="file"
          control={form.control}
          render={({ field: { onChange } }) => (
            <FileField
              label="Attachment File *"
              onChange={onChange}
              error={!!form.formState.errors.file}
              helperText={form.formState.errors.file?.message as string}
              disabled={disabled}
              required
              placeholder="Click to upload or drag and drop file"
            />
          )}
        />

        <Controller
          name="title"
          control={form.control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Title *"
              size="small"
              fullWidth
              error={!!form.formState.errors.title}
              helperText={form.formState.errors.title?.message}
              disabled={disabled}
            />
          )}
        />

        <Box display={"grid"} gridTemplateColumns={"2fr 1fr"} gap={1.5}>
          <Controller
            name="attachmentType"
            control={form.control}
            render={({ field, fieldState }) => (
              <FieldAsyncSelect
                {...field}
                value={field.value}
                onChange={field.onChange}
                label="Attachment Type"
                request={tblAttachmentType.getAll}
                getOptionLabel={(row) => row.name}
                error={!!fieldState.error?.message}
                helperText={fieldState.error?.message}
                disabled={disabled}
              />
            )}
          />

          <Controller
            name="isUserAttachment"
            control={form.control}
            render={({ field }) => (
              <FormControlLabel
                sx={{ margin: 0 }}
                control={
                  <Checkbox
                    size="small"
                    checked={field.value}
                    onChange={field.onChange}
                    disabled={disabled}
                  />
                }
                label="User Attachment"
              />
            )}
          />
        </Box>
      </Box>
    </TabContainer>
  );
}

export default memo(NewAttachmentTab);
