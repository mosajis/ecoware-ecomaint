import FormDialog from "@/shared/components/formDialog/FormDialog";
import FieldAsyncSelectGrid from "@/shared/components/fields/FieldAsyncSelectGrid";
import FieldDateTime from "@/shared/components/fields/FieldDateTime";
import { tblDiscipline, TypeTblDiscipline } from "@/core/api/generated/api";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import React, { useEffect, useState } from "react";

export interface DailyReportFilter {
  AND?: any[];
}

type FiltersState = {
  reportDateFrom: string;
  reportDateTo: string;

  createdDateFrom: string;
  createdDateTo: string;

  discipline: TypeTblDiscipline | null;
};

interface DailyReportFilterDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (filter: DailyReportFilter | null) => void;
  initialValue?: DailyReportFilter | null;
}

export default function DailyReportFilterDialog({
  open,
  onClose,
  onSubmit,
  initialValue,
}: DailyReportFilterDialogProps) {
  const deserializeFilter = (
    filter?: DailyReportFilter | null,
  ): FiltersState => {
    const base: FiltersState = {
      reportDateFrom: "",
      reportDateTo: "",
      createdDateFrom: "",
      createdDateTo: "",
      discipline: null,
    };

    if (!filter?.AND || !Array.isArray(filter.AND)) {
      return base;
    }

    for (const c of filter.AND) {
      if (c.discId) {
        base.discipline = {
          discId: c.discId,
        } as TypeTblDiscipline;
      }

      if (c.reportDate) {
        if (c.reportDate.gte) {
          base.reportDateFrom = new Date(c.reportDate.gte)
            .toISOString()
            .slice(0, 10);
        }

        if (c.reportDate.lte) {
          base.reportDateTo = new Date(c.reportDate.lte)
            .toISOString()
            .slice(0, 10);
        }
      }

      if (c.createdDate) {
        if (c.createdDate.gte) {
          base.createdDateFrom = new Date(c.createdDate.gte)
            .toISOString()
            .slice(0, 10);
        }

        if (c.createdDate.lte) {
          base.createdDateTo = new Date(c.createdDate.lte)
            .toISOString()
            .slice(0, 10);
        }
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

  const handleApply = () => {
    const conditions: any[] = [];

    if (filters.discipline) {
      conditions.push({
        discId: filters.discipline.discId,
      });
    }

    if (filters.reportDateFrom || filters.reportDateTo) {
      conditions.push({
        reportDate: {
          gte: filters.reportDateFrom
            ? new Date(filters.reportDateFrom)
            : undefined,
          lte: filters.reportDateTo
            ? new Date(filters.reportDateTo)
            : undefined,
        },
      });
    }

    if (filters.createdDateFrom || filters.createdDateTo) {
      conditions.push({
        createdDate: {
          gte: filters.createdDateFrom
            ? new Date(filters.createdDateFrom)
            : undefined,
          lte: filters.createdDateTo
            ? new Date(filters.createdDateTo)
            : undefined,
        },
      });
    }

    onSubmit({
      AND: conditions.length ? conditions : undefined,
    });

    onClose();
  };

  const handleClearFilter = () => {
    const empty = deserializeFilter(null);

    setFilters(empty);
    onSubmit(null);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleApply();
  };

  return (
    <FormDialog
      open={open}
      title="Daily Report Filter"
      maxWidth="sm"
      submitText="Apply Filter"
      cancelText="Clear Filter"
      onClose={onClose}
      onSubmit={handleSubmit}
      onCancelClick={handleClearFilter}
    >
      <Box display="flex" flexDirection="column" gap={2}>
        <FieldAsyncSelectGrid<TypeTblDiscipline>
          columns={[{ field: "name", headerName: "Name", flex: 1 }]}
          label="Discipline"
          value={filters.discipline}
          selectionMode="single"
          request={tblDiscipline.getAll}
          getRowId={(r) => r.discId}
          onChange={(v) =>
            setFilters((p) => ({
              ...p,
              discipline: v as any,
            }))
          }
        />

        <Divider />

        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
          <Box display="flex" flexDirection="column" gap={1}>
            <Typography variant="body2" fontWeight={500}>
              Report Date
            </Typography>

            <FieldDateTime
              type="DATE"
              label="From"
              field={{
                value: filters.reportDateFrom,
                onChange: (v: string) =>
                  setFilters((p) => ({
                    ...p,
                    reportDateFrom: v,
                  })),
              }}
            />

            <FieldDateTime
              type="DATE"
              label="To"
              field={{
                value: filters.reportDateTo,
                onChange: (v: string) =>
                  setFilters((p) => ({
                    ...p,
                    reportDateTo: v,
                  })),
              }}
            />
          </Box>

          <Box display="flex" flexDirection="column" gap={1}>
            <Typography variant="body2" fontWeight={500}>
              Created Date
            </Typography>

            <FieldDateTime
              type="DATE"
              label="From"
              field={{
                value: filters.createdDateFrom,
                onChange: (v: string) =>
                  setFilters((p) => ({
                    ...p,
                    createdDateFrom: v,
                  })),
              }}
            />

            <FieldDateTime
              type="DATE"
              label="To"
              field={{
                value: filters.createdDateTo,
                onChange: (v: string) =>
                  setFilters((p) => ({
                    ...p,
                    createdDateTo: v,
                  })),
              }}
            />
          </Box>
        </Box>
      </Box>
    </FormDialog>
  );
}
