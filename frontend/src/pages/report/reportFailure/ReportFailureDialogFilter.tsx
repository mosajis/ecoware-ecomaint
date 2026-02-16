import FormDialog from "@/shared/components/formDialog/FormDialog";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import FieldAsyncSelectGrid from "@/shared/components/fields/FieldAsyncSelectGrid";
import FieldDateTime from "@/shared/components/fields/FieldDateTime";
import FieldAsyncSelect from "@/shared/components/fields/FieldAsyncSelect";
import {
  tblComponentUnit,
  tblDiscipline,
  tblUsers,
  tblFailureSeverityLevel,
  tblFailureStatus,
  TypeTblComponentUnit,
  TypeTblDiscipline,
  TypeTblUsers,
  TypeTblFailureSeverityLevel,
  TypeTblFailureStatus,
} from "@/core/api/generated/api";
import { FormControlLabel, FormLabel } from "@mui/material";

export interface FailureReportFilter {
  AND?: any[];
}

type FiltersState = {
  statusMode: "open" | "closed" | "all";
  component: TypeTblComponentUnit | null;
  title: string;
  dateFrom: string;
  dateTo: string;
  discipline: TypeTblDiscipline | null;
  reportedBy: TypeTblUsers | null;
  severity: TypeTblFailureSeverityLevel | null;
  status: TypeTblFailureStatus | null;
  totalWait: string;
};

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (filter: FailureReportFilter | null) => void;
  initialFilters?: Partial<FiltersState>;
}

export default function FailureReportFilterDialog({
  open,
  onClose,
  onSubmit,
  initialFilters,
}: Props) {
  const getDefaultFilters = (): FiltersState => ({
    statusMode: "open",
    component: null,
    title: "",
    dateFrom: "",
    dateTo: "",
    discipline: null,
    reportedBy: null,
    severity: null,
    status: null,
    totalWait: "",
    ...initialFilters,
  });

  const [filters, setFilters] = useState<FiltersState>(getDefaultFilters());

  const handleApply = () => {
    const conditions: any[] = [];

    if (filters.statusMode === "open") {
      conditions.push({
        closedDateTime: null,
      });
    }

    if (filters.statusMode === "closed") {
      conditions.push({
        closedDateTime: { not: null },
      });
    }

    if (filters.component) {
      conditions.push({ compId: filters.component.compId });
    }

    if (filters.title) {
      conditions.push({
        title: { contains: filters.title },
      });
    }

    if (filters.dateFrom && filters.dateTo) {
      conditions.push({
        failureDateTime: {
          gte: new Date(filters.dateFrom),
          lte: new Date(filters.dateTo),
        },
      });
    }

    if (filters.discipline) {
      conditions.push({
        discId: filters.discipline.discId,
      });
    }

    if (filters.reportedBy) {
      conditions.push({
        reportedUserId: filters.reportedBy.userId,
      });
    }

    if (filters.severity) {
      conditions.push({
        failureSeverityLevelId: filters.severity.failureSeverityLevelId,
      });
    }

    if (filters.status) {
      conditions.push({
        failureStatusId: filters.status.failureStatusId,
      });
    }

    if (filters.totalWait) {
      conditions.push({
        totalWait: {
          gte: parseInt(filters.totalWait),
        },
      });
    }

    const prismaFilter: FailureReportFilter = {
      AND: conditions.length > 0 ? conditions : undefined,
    };

    onSubmit(prismaFilter);
    onClose();
  };

  const handleClear = () => {
    setFilters(getDefaultFilters());
  };

  return (
    <FormDialog
      open={open}
      title="Filter"
      submitText="Ok"
      cancelText="Clear"
      onClose={onClose}
      onSubmit={(e) => {
        e.preventDefault();
        handleApply();
      }}
      onCancelClick={handleClear}
    >
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems="center"
        fontWeight="bold"
      >
        Failure State
        <RadioGroup
          sx={{
            justifyContent: "center",
            gap: 1.5,
          }}
          row
          value={filters.statusMode}
          onChange={(e) =>
            setFilters((p) => ({
              ...p,
              statusMode: e.target.value as "open" | "closed" | "all",
            }))
          }
        >
          <FormControlLabel
            value="open"
            control={<Radio size="small" />}
            label="Open"
          />
          <FormControlLabel
            value="closed"
            control={<Radio size="small" />}
            label="Closed"
          />
          <FormControlLabel
            value="all"
            control={<Radio size="small" />}
            label="Show All"
          />
        </RadioGroup>
      </Box>
      <Box display="flex" gap={1.5} flexDirection="column">
        {/* Component */}
        <FieldAsyncSelectGrid
          label="Component"
          selectionMode="single"
          request={tblComponentUnit.getAll}
          value={filters.component}
          columns={[{ field: "compNo", headerName: "Name", flex: 1 }]}
          getRowId={(row) => row.compId}
          getOptionLabel={(row) => row.compNo}
          onChange={(v) =>
            setFilters((p) => ({
              ...p,
              component: v as TypeTblComponentUnit | null,
            }))
          }
        />

        {/* Title */}
        <TextField
          label="Title"
          size="small"
          value={filters.title}
          onChange={(e) => setFilters((p) => ({ ...p, title: e.target.value }))}
        />

        {/* Discipline + Reported By */}
        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1.5}>
          <FieldAsyncSelect<TypeTblDiscipline>
            label="Discipline"
            selectionMode="single"
            request={tblDiscipline.getAll}
            value={filters.discipline}
            getOptionLabel={(row) => row.name || ""}
            onChange={(v) =>
              setFilters((p) => ({
                ...p,
                discipline: v as TypeTblDiscipline | null,
              }))
            }
          />

          <FieldAsyncSelectGrid
            label="Reported By"
            selectionMode="single"
            request={tblUsers.getAll}
            value={filters.reportedBy}
            columns={[
              { field: "uName", headerName: "Name", flex: 1 },
              { field: "uUserName", headerName: "Username", flex: 1 },
            ]}
            getRowId={(row) => row.userId}
            getOptionLabel={(row) => row.uUserName}
            onChange={(v) =>
              setFilters((p) => ({
                ...p,
                reportedBy: v as TypeTblUsers | null,
              }))
            }
          />
        </Box>

        {/* Severity + Status */}
        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1.5}>
          <FieldAsyncSelect<TypeTblFailureSeverityLevel>
            label="Severity"
            selectionMode="single"
            request={tblFailureSeverityLevel.getAll}
            value={filters.severity}
            getOptionLabel={(row) => row.name || ""}
            onChange={(v) =>
              setFilters((p) => ({
                ...p,
                severity: v as TypeTblFailureSeverityLevel | null,
              }))
            }
          />

          <FieldAsyncSelect<TypeTblFailureStatus>
            label="Status"
            selectionMode="single"
            request={tblFailureStatus.getAll}
            value={filters.status}
            getOptionLabel={(row) => row.name || ""}
            onChange={(v) =>
              setFilters((p) => ({
                ...p,
                status: v as TypeTblFailureStatus | null,
              }))
            }
          />
        </Box>

        {/* Total Wait */}
        <TextField
          label="Total Wait"
          type="number"
          size="small"
          value={filters.totalWait}
          onChange={(e) =>
            setFilters((p) => ({ ...p, totalWait: e.target.value }))
          }
        />

        {/* Date Range */}
        <Box display="flex" gap={1.5}>
          <FieldDateTime
            type="DATE"
            label="From"
            field={{
              value: filters.dateFrom,
              onChange: (v: string) =>
                setFilters((p) => ({ ...p, dateFrom: v })),
            }}
          />
          <FieldDateTime
            type="DATE"
            label="To"
            field={{
              value: filters.dateTo,
              onChange: (v: string) => setFilters((p) => ({ ...p, dateTo: v })),
            }}
          />
        </Box>
      </Box>
    </FormDialog>
  );
}
