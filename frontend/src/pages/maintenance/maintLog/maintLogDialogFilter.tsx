import FormDialog from "@/shared/components/formDialog/FormDialog";
import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import InputAdornment from "@mui/material/InputAdornment";
import FieldAsyncSelectGrid from "@/shared/components/fields/FieldAsyncSelectGrid";
import FieldDateTime from "@/shared/components/fields/FieldDateTime";
import { daysAgo, extractFullName } from "@/core/helper";
import {
  tblMaintClass,
  tblMaintType,
  tblMaintCause,
  tblDiscipline,
  tblComponentUnit,
  TypeTblMaintClass,
  TypeTblMaintType,
  TypeTblMaintCause,
  TypeTblDiscipline,
  TypeTblComponentUnit,
  TypeTblWorkOrder,
  TypeTblJobClass,
  TypeTblEmployee,
  tblEmployee,
  tblCompType,
  TypeTblCompType,
} from "@/core/api/generated/api";

export interface MaintLogFilter {
  AND?: any[];
}

type DateRange = "1D" | "2D" | "3D" | "7D";

type FiltersState = {
  maintClass: TypeTblMaintClass | null;
  maintType: TypeTblMaintType | null;
  maintCause: TypeTblMaintCause | null;
  jobClass: TypeTblJobClass | null;
  discipline: TypeTblDiscipline | null;
  component: TypeTblComponentUnit | null;
  componentType: TypeTblCompType | null;
  reporter: TypeTblEmployee | null;
  workOrder: TypeTblWorkOrder | null;

  jobCode: string;

  doneFrom: string;
  doneTo: string;
  doneRange: DateRange | null;

  reportFrom: string;
  reportTo: string;
  reportRange: DateRange | null;

  routine: boolean;
  unplannedKpi: boolean;
  unplannedIgnore: boolean;

  control: boolean;
};

interface MaintLogFilterDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (filter: MaintLogFilter | null) => void;
  initialValue?: MaintLogFilter | null;
}

function unexpectedToCheckboxes(val: 0 | 1 | 2) {
  return {
    routine: val === 0,
    unplannedKpi: val === 1,
    unplannedIgnore: val === 2,
  };
}

function applyRange(value: DateRange): { from: string; to: string } {
  const now = new Date();
  const from = new Date();

  switch (value) {
    case "1D":
      from.setDate(now.getDate() - 1);
      break;
    case "2D":
      from.setDate(now.getDate() - 2);
      break;
    case "3D":
      from.setDate(now.getDate() - 3);
      break;
    case "7D":
      from.setDate(now.getDate() - 7);
      break;
  }

  return {
    from: from.toISOString().slice(0, 10),
    to: now.toISOString().slice(0, 10),
  };
}

export default function MaintLogFilterDialog({
  open,
  onClose,
  onSubmit,
  initialValue,
}: MaintLogFilterDialogProps) {
  const deserializeFilter = (filter?: MaintLogFilter | null): FiltersState => {
    const base: FiltersState = {
      maintClass: null,
      maintType: null,
      maintCause: null,
      jobClass: null,
      discipline: null,
      component: null,
      reporter: null,
      workOrder: null,
      jobCode: "",
      doneFrom: "",
      doneTo: "",
      doneRange: null,
      componentType: null,
      reportFrom: daysAgo(7).toISOString(),
      reportTo: new Date().toISOString(),
      reportRange: "7D",
      routine: true,
      unplannedKpi: false,
      unplannedIgnore: false,
      control: false,
    };

    if (!filter?.AND || !Array.isArray(filter.AND)) {
      return base;
    }

    for (const c of filter.AND) {
      if ("maintClassId" in c)
        base.maintClass = { maintClassId: c.maintClassId } as any;
      if ("maintTypeId" in c)
        base.maintType = { maintTypeId: c.maintTypeId } as any;
      if ("maintCauseId" in c)
        base.maintCause = { maintCauseId: c.maintCauseId } as any;
      if ("compId" in c) base.component = { compId: c.compId } as any;
      if ("reportedBy" in c)
        base.reporter = { employeeId: c.reportedBy } as any;
      if ("workOrderId" in c)
        base.workOrder = { workOrderId: c.workOrderId } as any;
      if ("compTypeId" in c)
        base.componentType = { compTypeId: c.compTypeId } as any;
      if ("unexpected" in c)
        Object.assign(base, unexpectedToCheckboxes(c.unexpected));

      if (c.tblDiscipline?.discId) {
        base.discipline = { discId: c.tblDiscipline.discId } as any;
      }
      if (
        c.tblWorkOrder?.tblCompJob?.tblJobDescription?.jobDescCode?.contains
      ) {
        base.jobCode =
          c.tblWorkOrder.tblCompJob.tblJobDescription.jobDescCode.contains;
      }

      if (c.dateDone) {
        if (c.dateDone.gte)
          base.doneFrom = new Date(c.dateDone.gte).toISOString().slice(0, 10);
        if (c.dateDone.lte)
          base.doneTo = new Date(c.dateDone.lte).toISOString().slice(0, 10);
      }
      if (c.reportedDate) {
        if (c.reportedDate.gte)
          base.reportFrom = new Date(c.reportedDate.gte)
            .toISOString()
            .slice(0, 10);
        if (c.reportedDate.lte)
          base.reportTo = new Date(c.reportedDate.lte)
            .toISOString()
            .slice(0, 10);
      }
    }

    return base;
  };

  const [filters, setFilters] = useState<FiltersState>(
    deserializeFilter(initialValue),
  );

  useEffect(() => {
    setFilters(deserializeFilter(initialValue));
  }, [initialValue]);

  const buildUnexpectedValue = (): 0 | 1 | 2 => {
    if (filters.unplannedKpi) return 1;
    if (filters.unplannedIgnore) return 2;
    return 0;
  };

  const handleApply = () => {
    const conditions: any[] = [];

    if (filters.maintClass)
      conditions.push({ maintClassId: filters.maintClass.maintClassId });
    if (filters.maintType)
      conditions.push({ maintTypeId: filters.maintType.maintTypeId });
    if (filters.maintCause)
      conditions.push({ maintCauseId: filters.maintCause.maintCauseId });
    if (filters.discipline)
      conditions.push({ tblDiscipline: { discId: filters.discipline.discId } });
    if (filters.component)
      conditions.push({ compId: filters.component.compId });
    if (filters.reporter)
      conditions.push({ reportedBy: filters.reporter.employeeId });
    if (filters.workOrder)
      conditions.push({ workOrderId: filters.workOrder.workOrderId });
    if (filters.jobCode) {
      conditions.push({
        tblWorkOrder: {
          tblCompJob: {
            tblJobDescription: { jobDescCode: { contains: filters.jobCode } },
          },
        },
      });
    }
    if (filters.doneFrom || filters.doneTo) {
      conditions.push({
        dateDone: {
          gte: filters.doneFrom ? new Date(filters.doneFrom) : undefined,
          lte: filters.doneTo ? new Date(filters.doneTo) : undefined,
        },
      });
    }
    if (filters.reportFrom || filters.reportTo) {
      conditions.push({
        reportedDate: {
          gte: filters.reportFrom ? new Date(filters.reportFrom) : undefined,
          lte: filters.reportTo ? new Date(filters.reportTo) : undefined,
        },
      });
    }
    if (filters.componentType)
      conditions.push({ compTypeId: filters.componentType.compTypeId });

    conditions.push({ unexpected: buildUnexpectedValue() });

    onSubmit({ AND: conditions.length > 0 ? conditions : undefined });
  };

  const handleClearFilter = () => {
    setFilters(deserializeFilter(null));
    onSubmit({
      AND: [{ reportedDate: { gte: new Date(daysAgo(7)), lte: new Date() } }],
    });
    onClose();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleApply();
  };

  const RangePills = ({
    value,
    onChange,
  }: {
    value: DateRange | null;
    onChange: (range: DateRange, from: string, to: string) => void;
  }) => (
    <ToggleButtonGroup size="small" exclusive value={value}>
      {[
        { v: "1D", label: "1D" },
        { v: "2D", label: "2D" },
        { v: "3D", label: "3D" },
        { v: "7D", label: "LW" },
      ].map((item) => (
        <ToggleButton
          key={item.v}
          value={item.v}
          onClick={() => {
            const { from, to } = applyRange(item.v as DateRange);
            onChange(item.v as DateRange, from, to);
          }}
          sx={{ flex: 1, fontSize: 11 }}
        >
          {item.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );

  return (
    <FormDialog
      open={open}
      title="MaintLog Filter"
      maxWidth="sm"
      submitText="Apply filter"
      cancelText="Reset to default"
      onClose={onClose}
      onSubmit={handleSubmit}
      onCancelClick={handleClearFilter}
    >
      <Box display="grid" flexDirection="column" gap={2}>
        {/* ===== Work Type Checkboxes ===== */}
        <Box
          display="flex"
          flexDirection="row"
          justifyContent={"space-between"}
          alignItems={"center"}
          gap={0.5}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={600}
            textTransform="uppercase"
            letterSpacing={0.5}
          >
            Work type
          </Typography>
          <FormGroup row sx={{ gap: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={filters.routine}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, routine: e.target.checked }))
                  }
                />
              }
              label="Routine"
            />
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={filters.unplannedKpi}
                  onChange={(e) =>
                    setFilters((p) => ({
                      ...p,
                      unplannedKpi: e.target.checked,
                    }))
                  }
                />
              }
              label={
                <Box display="flex" alignItems="center" gap={0.5}>
                  Unplanned
                  <Chip
                    label="KPI"
                    size="small"
                    color="warning"
                    sx={{ height: 18, fontSize: 10 }}
                  />
                </Box>
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={filters.unplannedIgnore}
                  onChange={(e) =>
                    setFilters((p) => ({
                      ...p,
                      unplannedIgnore: e.target.checked,
                    }))
                  }
                />
              }
              label={
                <Box display="flex" alignItems="center" gap={0.5}>
                  Unplanned
                  <Chip
                    label="Ignore"
                    size="small"
                    variant="outlined"
                    sx={{ height: 18, fontSize: 10 }}
                  />
                </Box>
              }
            />
          </FormGroup>
        </Box>

        <Divider />
        {/* ===== Component ===== */}
        <Box display="flex" flexDirection="column" gap={1}>
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={600}
            textTransform="uppercase"
            letterSpacing={0.5}
          >
            Component
          </Typography>
          <FieldAsyncSelectGrid<TypeTblComponentUnit>
            columns={[{ field: "compNo", headerName: "Component", flex: 1 }]}
            label="Component"
            value={filters.component}
            selectionMode="single"
            getOptionLabel={(row) => row.compNo}
            request={tblComponentUnit.getAll}
            getRowId={(r) => r.compId}
            onChange={(v) => setFilters((p) => ({ ...p, component: v as any }))}
          />
          <FieldAsyncSelectGrid<TypeTblCompType>
            columns={[{ field: "compName", headerName: "Name", flex: 1 }]}
            label="Component Type"
            value={filters.componentType}
            selectionMode="single"
            request={tblCompType.getAll}
            getOptionLabel={(row) => row.compName}
            getRowId={(r) => r.compTypeId}
            onChange={(v) =>
              setFilters((p) => ({ ...p, componentType: v as any }))
            }
          />
        </Box>

        <Divider />

        {/* ===== Classification ===== */}
        <Box display="flex" flexDirection="column" gap={1}>
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={600}
            textTransform="uppercase"
            letterSpacing={0.5}
          >
            Classification
          </Typography>
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1.5}>
            <Box display="flex" flexDirection="column" gap={1}>
              <FieldAsyncSelectGrid
                columns={[
                  { field: "descr", headerName: "Description", flex: 1 },
                ]}
                label="Maint Class"
                value={filters.maintClass}
                selectionMode="single"
                request={tblMaintClass.getAll}
                getRowId={(r) => r.maintClassId}
                onChange={(v) =>
                  setFilters((p) => ({ ...p, maintClass: v as any }))
                }
              />
              <FieldAsyncSelectGrid
                columns={[
                  { field: "descr", headerName: "Description", flex: 1 },
                ]}
                label="Maint Cause"
                value={filters.maintCause}
                selectionMode="single"
                request={tblMaintCause.getAll}
                getRowId={(r) => r.maintCauseId}
                onChange={(v) =>
                  setFilters((p) => ({ ...p, maintCause: v as any }))
                }
              />
              <FieldAsyncSelectGrid
                columns={[
                  { field: "descr", headerName: "Description", flex: 1 },
                ]}
                label="Maint Type"
                value={filters.maintType}
                selectionMode="single"
                request={tblMaintType.getAll}
                getRowId={(r) => r.maintTypeId}
                onChange={(v) =>
                  setFilters((p) => ({ ...p, maintType: v as any }))
                }
              />
            </Box>
            <Box display="flex" flexDirection="column" gap={1}>
              <FieldAsyncSelectGrid
                columns={[{ field: "name", headerName: "Name", flex: 1 }]}
                label="Discipline"
                value={filters.discipline}
                selectionMode="single"
                request={tblDiscipline.getAll}
                getRowId={(r) => r.discId}
                onChange={(v) =>
                  setFilters((p) => ({ ...p, discipline: v as any }))
                }
              />
              <FieldAsyncSelectGrid
                columns={[
                  { field: "firstName", headerName: "First Name", flex: 1 },
                  { field: "lastName", headerName: "Last Name", flex: 1 },
                ]}
                label="Reporter"
                value={filters.reporter}
                getOptionLabel={(row: TypeTblEmployee) => extractFullName(row)}
                selectionMode="single"
                request={tblEmployee.getAll}
                getRowId={(r) => r.employeeId}
                onChange={(v) =>
                  setFilters((p) => ({ ...p, reporter: v as any }))
                }
              />
              <TextField
                label="Job Code"
                size="small"
                value={filters.jobCode}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, jobCode: e.target.value }))
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">#</InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>
        </Box>

        <Divider />

        {/* ===== Date Ranges ===== */}
        <Box display="flex" flexDirection="column" gap={1}>
          <Box display="flex" gap={2}>
            {/* Done between */}
            <Box display="flex" gap={0.75} flexDirection="column" width="100%">
              <Typography
                variant="body2"
                fontWeight={500}
                color="text.secondary"
              >
                Done between
              </Typography>
              <FieldDateTime
                type="DATE"
                label="From"
                field={{
                  value: filters.doneFrom,
                  onChange: (v: string) =>
                    setFilters((p) => ({ ...p, doneFrom: v, doneRange: null })),
                }}
              />
              <FieldDateTime
                type="DATE"
                label="To"
                field={{
                  value: filters.doneTo,
                  onChange: (v: string) =>
                    setFilters((p) => ({ ...p, doneTo: v, doneRange: null })),
                }}
              />
              <RangePills
                value={filters.doneRange}
                onChange={(range, from, to) =>
                  setFilters((p) => ({
                    ...p,
                    doneRange: range,
                    doneFrom: from,
                    doneTo: to,
                  }))
                }
              />
            </Box>

            {/* Report between */}
            <Box display="flex" gap={0.75} flexDirection="column" width="100%">
              <Typography
                variant="body2"
                fontWeight={500}
                color="text.secondary"
              >
                Report between
              </Typography>
              <FieldDateTime
                type="DATE"
                label="From"
                field={{
                  value: filters.reportFrom,
                  onChange: (v: string) =>
                    setFilters((p) => ({
                      ...p,
                      reportFrom: v,
                      reportRange: null,
                    })),
                }}
              />
              <FieldDateTime
                type="DATE"
                label="To"
                field={{
                  value: filters.reportTo,
                  onChange: (v: string) =>
                    setFilters((p) => ({
                      ...p,
                      reportTo: v,
                      reportRange: null,
                    })),
                }}
              />
              <RangePills
                value={filters.reportRange}
                onChange={(range, from, to) =>
                  setFilters((p) => ({
                    ...p,
                    reportRange: range,
                    reportFrom: from,
                    reportTo: to,
                  }))
                }
              />
            </Box>
          </Box>
        </Box>

        <Divider />
      </Box>
    </FormDialog>
  );
}
