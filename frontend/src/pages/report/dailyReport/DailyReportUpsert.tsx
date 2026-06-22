import * as z from "zod";
import Box from "@mui/material/Box";
import Editor from "@/shared/components/Editor";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import FieldDateTime from "@/shared/components/fields/FieldDateTime";
import { memo } from "react";
import { Controller } from "react-hook-form";
import { useUpsertForm } from "@/shared/hooks/useUpsertForm";
import { tblDailyReport, TypeTblDailyReport } from "@/core/api/generated/api";

const schema = z.object({
  reportDate: z.string().refine((val) => new Date(val) <= new Date(), {
    message: "Report date cannot be in the future",
  }),
  userComment: z.string().nullable(),
});

type DailyReportFormValues = z.input<typeof schema>;

const defaultValues: DailyReportFormValues = {
  reportDate: new Date().toISOString(),
  userComment: "",
};

function DailyReportUpsert({
  entityName,
  open,
  mode,
  recordId,
  onClose,
  onSuccess,
}: UpsertProps) {
  const {
    form,
    loadingInitial,
    submitting,
    isDisabled,
    readonly,
    title,
    handleFormSubmit,
  } = useUpsertForm<DailyReportFormValues, TypeTblDailyReport>({
    entityName,
    open,
    mode,
    recordId,
    schema,
    defaultValues,

    onFetch: async (id) => {
      const res = await tblDailyReport.getById(id);

      return {
        reportDate: res?.reportDate
          ? new Date(res.reportDate).toISOString()
          : new Date().toISOString(),
        userComment: res?.userComment ?? "",
      };
    },

    onCreate: tblDailyReport.create,
    onUpdate: tblDailyReport.update,

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
      <Box display="grid" gridTemplateRows="repeat(auto, 1fr)" gap={1.5}>
        <Controller
          name="reportDate"
          control={control}
          render={({ field }) => (
            <FieldDateTime
              field={field}
              label="Report Date"
              error={!!errors.reportDate}
              helperText={errors.reportDate?.message}
              disabled={isDisabled}
              pickerProps={{ readOnly: mode === "update", maxDate: new Date() }}
            />
          )}
        />

        <Controller
          name="userComment"
          control={control}
          render={({ field }) => (
            <Editor
              initValue={field.value}
              onChange={field.onChange}
              label="Comment"
              error={!!errors.userComment}
              helperText={errors.userComment?.message}
              disabled={isDisabled}
              containerStyle={{ height: 350 }}
            />
          )}
        />
      </Box>
    </FormDialog>
  );
}

export default memo(DailyReportUpsert);
