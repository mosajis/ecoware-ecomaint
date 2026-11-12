import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";

import { Controller } from "react-hook-form";
import { memo, useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import FormDialog from "@/shared/components/formDialog/FormDialog";
import FieldAsyncSelectGrid from "@/shared/components/fields/FieldAsyncSelectGrid";
import FieldDateTime from "@/shared/components/fields/FieldDateTime";
import NumberField from "@/shared/components/fields/FieldNumber";

import {
  tblOilSamplingLog,
  tblEmployee,
  TypeTblOilSamplingLog,
} from "@/core/api/generated/api";

import { getOilSamplingLogContext } from "@/core/api/api";

import { useUpsertForm } from "@/shared/hooks/useUpsertForm";

// -----------------------------------------------------
// Types
// -----------------------------------------------------

type OilSamplingLogUpsertProps = {
  open: boolean;
  title: string;
  mode: "create" | "view";

  // This is maintLogId, NOT oilSamplingLogId.
  recordId?: number | null;

  onClose: () => void;
  onSuccess?: (result: TypeTblOilSamplingLog) => void;
};

type OilSamplingLogContext = Awaited<
  ReturnType<typeof getOilSamplingLogContext>
>;

type TypeValues = {
  sampler: any | null;
  senderToLab: any | null;

  compCounterVal: number;
  oilCounterVal: number;

  changeOilDate: Date | null;
  addOilVal: number | null;

  samplingdate: Date;
  testDate: Date;
  sendToLaboratoryDate: Date | null;

  tankCapacity: number | null;
  samplingPosition: string;
  oilDesc: string;

  resultDesc: string;
  actionDesc: string;

  ladingBillNnumber: string;
  customerName: string;
  locationName: string;
  laboratoryCode: string;
  userComment: string;

  orderNo: number | null;
};

const toTimestamp = (date: Date | null | undefined) =>
  date ? date.getTime() : null;

// -----------------------------------------------------
// Schema
// -----------------------------------------------------

const schema = z.object({
  sampler: z.any().nullable(),
  senderToLab: z.any().nullable(),

  compCounterVal: z.coerce.number().min(0),
  oilCounterVal: z.coerce.number().min(0),

  changeOilDate: z.date().nullable(),
  addOilVal: z.coerce.number().nullable(),

  samplingdate: z.date(),
  testDate: z.date(),
  sendToLaboratoryDate: z.date().nullable(),

  tankCapacity: z.coerce.number().nullable(),
  samplingPosition: z.string(),
  oilDesc: z.string(),

  resultDesc: z.string(),
  actionDesc: z.string(),

  ladingBillNnumber: z.string(),
  customerName: z.string(),
  locationName: z.string(),
  laboratoryCode: z.string(),
  userComment: z.string(),

  orderNo: z.coerce.number().nullable(),
});

// -----------------------------------------------------
// Default Values
// -----------------------------------------------------

const defaultValues: TypeValues = {
  sampler: null,
  senderToLab: null,

  compCounterVal: 0,
  oilCounterVal: 0,

  changeOilDate: null,
  addOilVal: null,

  samplingdate: new Date(),
  testDate: new Date(),
  sendToLaboratoryDate: null,

  tankCapacity: null,
  samplingPosition: "",
  oilDesc: "",

  resultDesc: "",
  actionDesc: "",

  ladingBillNnumber: "",
  customerName: "",
  locationName: "",
  laboratoryCode: "",
  userComment: "",

  orderNo: null,
};

// -----------------------------------------------------
// Helpers
// -----------------------------------------------------

const toDate = (value: string | null | undefined): Date | null => {
  if (!value) return null;

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
};

// -----------------------------------------------------
// Component
// -----------------------------------------------------

function OilSamplingLogUpsert({
  open,
  title,
  mode,
  recordId: maintLogId,
  onClose,
  onSuccess,
}: OilSamplingLogUpsertProps) {
  const [context, setContext] = useState<OilSamplingLogContext | null>(null);

  const [loadingContext, setLoadingContext] = useState(false);

  // ---------------------------------------------------
  // Form
  // ---------------------------------------------------

  const { form, loadingInitial, submitting, readonly, handleFormSubmit } =
    useUpsertForm<TypeValues, TypeTblOilSamplingLog>({
      entityName: "Oil Sampling Log",

      open,
      mode,

      // This form only creates new Oil Sampling Logs.
      // recordId belongs to MaintLog.
      recordId: null,

      schema,
      defaultValues,

      onFetch: async () => {
        throw new Error("Fetch is not supported");
      },

      onCreate: async (values) => {
        if (!maintLogId) {
          toast.error("Maintenance Log ID is missing");
          throw new Error("Maintenance Log ID is missing");
        }

        if (!context?.compOilInfoId) {
          toast.error("Component Oil Information is missing");
          throw new Error("Component Oil Information is missing");
        }

        const payload = {
          maintLogId,
          changeOilDate: toTimestamp(values.changeOilDate),
          samplingdate: values.samplingdate.getTime(),
          testDate: values.testDate.getTime(),
          sendToLaboratoryDate: toTimestamp(values.sendToLaboratoryDate),
          compOilInfoId: context.compOilInfoId,

          samplerId: values.sampler?.employeeId ?? null,
          senderToLabId: values.senderToLab?.employeeId ?? null,

          compCounterVal: values.compCounterVal,
          oilCounterVal: values.oilCounterVal,

          addOilVal: values.addOilVal,

          tankCapacity: values.tankCapacity,
          samplingPosition: values.samplingPosition,
          oilDesc: values.oilDesc,

          resultDesc: values.resultDesc,
          actionDesc: values.actionDesc,

          ladingBillNnumber: values.ladingBillNnumber,
          customerName: values.customerName,
          locationName: values.locationName,

          laboratoryCode: values.laboratoryCode,
          userComment: values.userComment,

          orderNo: values.orderNo,
        };

        const result = await tblOilSamplingLog.create(payload);

        toast.success("Oil Sampling Log created successfully");

        return result;
      },

      onClose,
      onSuccess,
    });

  const { control, reset } = form;

  // ---------------------------------------------------
  // Load Context
  // ---------------------------------------------------

  useEffect(() => {
    if (!open || mode !== "create") {
      setContext(null);
      setLoadingContext(false);
      return;
    }

    if (!maintLogId) {
      setContext(null);
      setLoadingContext(false);
      reset(defaultValues);
      return;
    }

    let active = true;

    const loadContext = async () => {
      setContext(null);
      setLoadingContext(true);

      // Prevent showing values from the previous component.
      reset({
        ...defaultValues,
        samplingdate: new Date(),
        testDate: new Date(),
      });

      try {
        const contextData = await getOilSamplingLogContext({
          maintLogId,
        });

        if (!active) return;

        setContext(contextData);

        const defaults = contextData.defaults;

        reset({
          ...defaultValues,

          // Counter values
          compCounterVal: defaults.compCounterVal ?? 0,
          oilCounterVal: defaults.oilCounterVal ?? 0,

          // Oil information
          tankCapacity: defaults.tankCapacity ?? null,
          samplingPosition: defaults.samplingPosition ?? "",
          laboratoryCode: defaults.laboratoryCode ?? "",
          oilDesc: defaults.oilDesc ?? "",

          orderNo: defaults.orderNo ?? null,

          // Previous oil change information
          changeOilDate: toDate(defaults.changeOilDate),
          addOilVal: defaults.addOilVal ?? null,

          // New sampling dates
          samplingdate: new Date(),
          testDate: new Date(),

          // Employee selections
          sampler: null,
          senderToLab: null,
        });
      } catch (error) {
        if (!active) return;

        console.error("Oil Sampling Context Error:", error);

        setContext(null);

        toast.error("Failed to load Oil Sampling context");
      } finally {
        if (active) {
          setLoadingContext(false);
        }
      }
    };

    loadContext();

    return () => {
      active = false;
    };
  }, [open, mode, maintLogId, reset]);

  // ---------------------------------------------------
  // Render
  // ---------------------------------------------------

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title={title}
      submitting={submitting}
      loadingInitial={loadingInitial || loadingContext}
      onSubmit={handleFormSubmit}
      readonly={readonly}
      maxWidth="lg"
    >
      <Box display="grid" gap={2} gridTemplateColumns="1fr 1fr 1fr">
        {/* Component Information */}

        {/* Sampling Information */}

        <Box display="grid" gap={1.5}>
          <Controller
            name="samplingdate"
            control={control}
            render={({ field, fieldState }) => (
              <FieldDateTime
                field={field}
                type="DATETIME"
                label="Sampling Date *"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="testDate"
            control={control}
            render={({ field, fieldState }) => (
              <FieldDateTime
                field={field}
                type="DATETIME"
                label="Test Date *"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="sendToLaboratoryDate"
            control={control}
            render={({ field, fieldState }) => (
              <FieldDateTime
                field={field}
                type="DATETIME"
                label="Send To Laboratory Date"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="sampler"
            control={control}
            render={({ field, fieldState }) => (
              <FieldAsyncSelectGrid
                label="Sampler"
                value={field.value}
                request={tblEmployee.getAll}
                columns={[
                  {
                    field: "fullName",
                    headerName: "Employee",
                    flex: 1,
                  },
                ]}
                getRowId={(row) => row.employeeId}
                onChange={field.onChange}
                error={!!fieldState.error}
              />
            )}
          />

          <Controller
            name="senderToLab"
            control={control}
            render={({ field, fieldState }) => (
              <FieldAsyncSelectGrid
                label="Sender To Laboratory"
                value={field.value}
                request={tblEmployee.getAll}
                columns={[
                  {
                    field: "fullName",
                    headerName: "Employee",
                    flex: 1,
                  },
                ]}
                getRowId={(row) => row.employeeId}
                onChange={field.onChange}
                error={!!fieldState.error}
              />
            )}
          />
        </Box>

        <Box display="grid" gap={1.5}>
          <Controller
            name="compCounterVal"
            control={control}
            render={({ field, fieldState }) => (
              <NumberField
                label="Component Counter Value"
                field={field}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="oilCounterVal"
            control={control}
            render={({ field, fieldState }) => (
              <NumberField
                label="Oil Counter Value"
                field={field}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="changeOilDate"
            control={control}
            render={({ field, fieldState }) => (
              <FieldDateTime
                field={field}
                type="DATETIME"
                label="Change Oil Date"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="addOilVal"
            control={control}
            render={({ field, fieldState }) => (
              <NumberField
                label="Add Oil Value"
                field={field}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="tankCapacity"
            control={control}
            render={({ field, fieldState }) => (
              <NumberField
                label="Tank Capacity"
                field={field}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Box>

        {/* Laboratory Information */}

        <Box display="grid" gap={1.5}>
          <Controller
            name="laboratoryCode"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Laboratory Code"
                fullWidth
                size="small"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="samplingPosition"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Sampling Position"
                fullWidth
                size="small"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="oilDesc"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Oil Description"
                fullWidth
                multiline
                rows={2}
                size="small"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Box>

        {/* Additional Information */}

        <Box display="grid" gap={1.5}>
          <Controller
            name="ladingBillNnumber"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Lading Bill Number"
                fullWidth
                size="small"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="customerName"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Customer Name"
                fullWidth
                size="small"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="locationName"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Location"
                fullWidth
                size="small"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="orderNo"
            control={control}
            render={({ field, fieldState }) => (
              <NumberField
                label="Order No"
                field={field}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Box>

        {/* Result Information */}

        <Box gridColumn="span 2">
          <Controller
            name="resultDesc"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Result Description"
                fullWidth
                multiline
                rows={4}
                size="small"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Box mt={1.5}>
            <Controller
              name="actionDesc"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Action Description"
                  fullWidth
                  multiline
                  rows={4}
                  size="small"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Box>

          <Box mt={1.5}>
            <Controller
              name="userComment"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="User Comment"
                  fullWidth
                  multiline
                  rows={3}
                  size="small"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Box>
        </Box>
      </Box>
    </FormDialog>
  );
}

export default memo(OilSamplingLogUpsert);
