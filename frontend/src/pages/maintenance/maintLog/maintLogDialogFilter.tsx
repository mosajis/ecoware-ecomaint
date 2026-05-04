import FormDialog from "@/shared/components/formDialog/FormDialog";
import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import FieldAsyncSelectGrid from "@/shared/components/fields/FieldAsyncSelectGrid";
import FieldDateTime from "@/shared/components/fields/FieldDateTime";

import {
  tblMaintClass,
  tblMaintType,
  tblMaintCause,
  tblDiscipline,
  tblComponentUnit,
  tblWorkOrder,
  TypeTblMaintClass,
  TypeTblMaintType,
  TypeTblMaintCause,
  TypeTblDiscipline,
  TypeTblComponentUnit,
  TypeTblWorkOrder,
  TypeTblJobClass,
  TypeTblEmployee,
  tblEmployee,
} from "@/core/api/generated/api";
import { extractFullName } from "@/core/helper";

export interface MaintLogFilter {
  AND?: any[];
}

type FiltersState = {
  maintClass: TypeTblMaintClass | null;
  maintType: TypeTblMaintType | null;
  maintCause: TypeTblMaintCause | null;
  jobClass: TypeTblJobClass | null;
  discipline: TypeTblDiscipline | null;
  component: TypeTblComponentUnit | null;
  reporter: TypeTblEmployee | null;
  workOrder: TypeTblWorkOrder | null;

  jobCode: string;
  doneFrom: string;
  doneTo: string;
  reportFrom: string;
  reportTo: string;
  // unexpected: number;
  control: boolean;
};

interface MaintLogFilterDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (filter: MaintLogFilter | null) => void;
  initialValue?: MaintLogFilter | null;
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
      reportFrom: "",
      reportTo: "",
      // unexpected: 0,
      control: false,
    };

    if (!filter?.AND || !Array.isArray(filter.AND)) {
      return base;
    }

    const conditions = filter.AND;

    for (const c of conditions) {
      if ("maintClassId" in c) {
        base.maintClass = { maintClassId: c.maintClassId } as any;
      }

      if ("maintTypeId" in c) {
        base.maintType = { maintTypeId: c.maintTypeId } as any;
      }

      if ("maintCauseId" in c) {
        base.maintCause = { maintCauseId: c.maintCauseId } as any;
      }

      if ("compId" in c) {
        base.component = { compId: c.compId } as any;
      }

      if ("reporterId" in c) {
        base.reporter = { employeeId: c.reporterId } as any;
      }

      if ("workOrderId" in c) {
        base.workOrder = { workOrderId: c.workOrderId } as any;
      }

      // ----------- Nested -----------

      if (c.tblDiscipline?.disciplineId) {
        base.discipline = {
          disciplineId: c.tblDiscipline.disciplineId,
        } as any;
      }

      if (
        c.tblWorkOrder?.tblCompJob?.tblJobDescription?.jobDescCode?.contains
      ) {
        base.jobCode =
          c.tblWorkOrder.tblCompJob.tblJobDescription.jobDescCode.contains;
      }

      // ----------- Dates -----------

      if (c.dateDone) {
        if (c.dateDone.gte)
          base.doneFrom = new Date(c.dateDone.gte).toISOString().slice(0, 10);

        if (c.dateDone.lte)
          base.doneTo = new Date(c.dateDone.lte).toISOString().slice(0, 10);
      }

      if (c.reportDate) {
        if (c.reportDate.gte)
          base.reportFrom = new Date(c.reportDate.gte)
            .toISOString()
            .slice(0, 10);

        if (c.reportDate.lte)
          base.reportTo = new Date(c.reportDate.lte).toISOString().slice(0, 10);
      }

      // ----------- Booleans -----------

      // if (c.unexpected === false) {
      //   base.unexpected = 1;
      // }
    }

    return base;
  };

  const [filters, setFilters] = useState<FiltersState>(
    deserializeFilter(initialValue),
  );

  // 🔥 مهم: sync با route وقتی filter عوض شد
  useEffect(() => {
    setFilters(deserializeFilter(initialValue));
  }, [initialValue]);

  // ---------------------------
  // Build Prisma Filter
  // ---------------------------
  const handleApply = () => {
    const conditions: any[] = [];

    // Ensure the mapping is aligned with your schema
    if (filters.maintClass) {
      conditions.push({ maintClassId: filters.maintClass.maintClassId });
    }

    if (filters.maintType) {
      conditions.push({ maintTypeId: filters.maintType.maintTypeId });
    }

    if (filters.maintCause) {
      conditions.push({ maintCauseId: filters.maintCause.maintCauseId });
    }

    if (filters.discipline) {
      conditions.push({
        tblDiscipline: {
          discId: filters.discipline.discId, // align field name
        },
      });
    }

    if (filters.component) {
      conditions.push({ compId: filters.component.compId });
    }

    if (filters.reporter) {
      conditions.push({ reportedBy: filters.reporter.employeeId });
    }

    if (filters.workOrder) {
      conditions.push({ workOrderId: filters.workOrder.workOrderId });
    }

    if (filters.jobCode) {
      conditions.push({
        tblWorkOrder: {
          tblCompJob: {
            tblJobDescription: {
              jobDescCode: {
                contains: filters.jobCode,
              },
            },
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

    // if (filters.unexpected) {
    //   conditions.push({ unexpected: 1 });
    // }

    const prismaFilter: MaintLogFilter = {
      AND: conditions.length > 0 ? conditions : undefined,
    };

    onSubmit(prismaFilter);
  };

  const handleClearFilter = () => {
    setFilters(deserializeFilter(null));
    onSubmit(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleApply();
  };

  return (
    <FormDialog
      open={open}
      title="Maint Log Filter"
      maxWidth="sm"
      submitText="Ok"
      cancelText="Clear"
      onClose={onClose}
      onSubmit={handleSubmit}
      onCancelClick={handleClearFilter}
    >
      <Box display="flex" flexDirection="column" gap={1.5}>
        {/* ===== Async Selects ===== */}
        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1.5}>
          <Box display={"flex"} flexDirection={"column"} gap={1.5}>
            <FieldAsyncSelectGrid
              columns={[{ field: "descr", headerName: "Description", flex: 1 }]}
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
              columns={[{ field: "descr", headerName: "Description", flex: 1 }]}
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
              columns={[{ field: "descr", headerName: "Description", flex: 1 }]}
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
          <Box display={"flex"} flexDirection={"column"} gap={1.5}>
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
                {
                  field: "firstName",
                  headerName: "First Name",
                  flex: 1,
                },
                {
                  field: "lastName",
                  headerName: "Last Name",
                  flex: 1,
                },
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
            {/* <FormControlLabel
              control={
                <Checkbox
                  checked={Boolean(filters.unexpected)}
                  onChange={(e) =>
                    setFilters((p) => ({
                      ...p,
                      unexpected: e.target.checked ? 1 : 0,
                    }))
                  }
                />
              }
              label="unExpected"
            /> */}
          </Box>
        </Box>
        <Box display={"flex"} flexDirection={"column"} gap={1.5}>
          <FieldAsyncSelectGrid
            columns={[
              {
                field: "title",
                headerName: "Title",
                flex: 1,
              },
            ]}
            label="Work Order"
            getOptionLabel={(row) => row.title}
            value={filters.workOrder}
            selectionMode="single"
            request={() =>
              tblWorkOrder.getAll({
                select: { workOrderId: true, title: true },
              })
            }
            getRowId={(r) => r.workOrderId}
            onChange={(v) => setFilters((p) => ({ ...p, workOrder: v as any }))}
          />
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
        </Box>
        <Divider />

        {/* ===== Job Code ===== */}
        <TextField
          label="Job Code"
          size="small"
          value={filters.jobCode}
          onChange={(e) =>
            setFilters((p) => ({ ...p, jobCode: e.target.value }))
          }
        />

        <Divider />

        {/* ===== Date Ranges ===== */}
        <Box display={"flex"} gap={1.5}>
          <Box display="flex" gap={1} flexDirection={"column"} width={"100%"}>
            <Typography fontWeight="bold">Done Between</Typography>
            <FieldDateTime
              type="DATE"
              label="From"
              field={{
                value: filters.doneFrom,
                onChange: (v: string) =>
                  setFilters((p) => ({ ...p, doneFrom: v })),
              }}
            />
            <FieldDateTime
              type="DATE"
              label="To"
              field={{
                value: filters.doneTo,
                onChange: (v: string) =>
                  setFilters((p) => ({ ...p, doneTo: v })),
              }}
            />
          </Box>

          <Box display="flex" gap={1} flexDirection={"column"} width={"100%"}>
            <Typography fontWeight="bold">Report Between</Typography>
            <FieldDateTime
              type="DATE"
              label="From"
              field={{
                value: filters.reportFrom,
                onChange: (v: string) =>
                  setFilters((p) => ({ ...p, reportFrom: v })),
              }}
            />
            <FieldDateTime
              type="DATE"
              label="To"
              field={{
                value: filters.reportTo,
                onChange: (v: string) =>
                  setFilters((p) => ({ ...p, reportTo: v })),
              }}
            />
          </Box>
        </Box>
      </Box>
    </FormDialog>
  );
}
