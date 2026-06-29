import FormDialog from "@/shared/components/formDialog/FormDialog";
import FieldDateTime from "@/shared/components/fields/FieldDateTime";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import React, { useEffect, useState } from "react";
import FieldAsyncSelect from "@/shared/components/fields/FieldAsyncSelect";
import { tblDiscipline, TypeTblDiscipline } from "@/core/api/generated/api";
import { useAtomValue } from "jotai";
import { atomUser } from "@/pages/auth/auth.atom";
import { daysAgo } from "@/core/helper";
import { endOfDay, startOfDay } from "date-fns";

export interface DailyReportFilter {
  AND?: any[];
}

type FiltersState = {
  reportDateFrom: string;
  reportDateTo: string;

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
  const user = useAtomValue(atomUser);
  const disipline = user?.tblEmployee?.tblDiscipline as TypeTblDiscipline;

  const deserializeFilter = (
    filter?: DailyReportFilter | null,
  ): FiltersState => {
    const base: FiltersState = {
      reportDateFrom: startOfDay(daysAgo(14)).toISOString(),
      reportDateTo: endOfDay(new Date()).toISOString(),
      discipline: disipline,
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

    onSubmit({
      AND: conditions.length ? conditions : undefined,
    });

    onClose();
  };

  const handleClearFilter = () => {
    const empty: FiltersState = {
      reportDateFrom: startOfDay(daysAgo(14)).toISOString(),
      reportDateTo: endOfDay(new Date()).toISOString(),
      discipline: disipline,
    };

    setFilters(empty);

    onSubmit({
      AND: [
        {
          discId: disipline.discId,
        },
        {
          reportDate: {
            gte: new Date(daysAgo(14)),
            lte: new Date(),
          },
        },
      ],
    });

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
      maxWidth="xs"
      submitText="Apply Filter"
      cancelText="Clear Filter"
      onClose={onClose}
      onSubmit={handleSubmit}
      onCancelClick={handleClearFilter}
    >
      <Box display="flex" flexDirection="column" gap={2}>
        <FieldAsyncSelect<TypeTblDiscipline>
          getOptionLabel={(r) => r.name || "UnKnown"}
          label="Discipline"
          value={filters.discipline}
          selectionMode="single"
          getOptionKey={(r) => r.discId}
          request={tblDiscipline.getAll}
          onChange={(v) =>
            setFilters((p) => ({
              ...p,
              discipline: v as any,
            }))
          }
        />

        <Divider />

        <Box display="grid" gridTemplateColumns="1fr" gap={2}>
          <Box display="flex" flexDirection="column" gap={1}>
            <Typography variant="body2" fontWeight={500}>
              Report Date
            </Typography>

            <FieldDateTime
              type="DATETIME"
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
              type="DATETIME"
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
        </Box>
      </Box>
    </FormDialog>
  );
}
