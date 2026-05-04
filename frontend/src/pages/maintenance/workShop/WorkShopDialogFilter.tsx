import FormDialog from "@/shared/components/formDialog/FormDialog";
import Box from "@mui/material/Box";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import TextField from "@mui/material/TextField";
import FieldAsyncSelect from "@/shared/components/fields/FieldAsyncSelect";
import FieldAsyncSelectGrid from "@/shared/components/fields/FieldAsyncSelectGrid";
import FieldDateTime from "@/shared/components/fields/FieldDateTime";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useState } from "react";
import {
  tblDiscipline,
  tblEmployee,
  TypeTblDiscipline,
  TypeTblEmployee,
} from "@/core/api/generated/api";
import { extractFullName } from "@/core/helper";

export interface WorkShopFilter {
  AND?: any[];
}

type FiltersState = {
  statusMode: "open" | "closed" | "all";
  workShopNo: string;
  discipline: TypeTblDiscipline | null;
  personInCharge: TypeTblEmployee | null;
  personInChargeApprove: TypeTblEmployee | null;
  awardingDateFrom: string;
  awardingDateTo: string;
  createdDateFrom: string;
  createdDateTo: string;
};

const DEFAULT_FILTERS: FiltersState = {
  statusMode: "open",
  workShopNo: "",
  discipline: null,
  personInCharge: null,
  personInChargeApprove: null,
  awardingDateFrom: "",
  awardingDateTo: "",
  createdDateFrom: "",
  createdDateTo: "",
};

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (filter: WorkShopFilter | null) => void;
  initialFilters?: Partial<FiltersState>;
}

export default function WorkShopDialogFilter({
  open,
  onClose,
  onSubmit,
  initialFilters,
}: Props) {
  const getDefaultFilters = (): FiltersState => ({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  });

  const [filters, setFilters] = useState<FiltersState>(getDefaultFilters());

  const handleApply = () => {
    const conditions: any[] = [];

    // Open / Closed / All
    if (filters.statusMode === "open") {
      conditions.push({ closedDate: null });
    } else if (filters.statusMode === "closed") {
      conditions.push({ closedDate: { not: null } });
    }

    // WorkShop No
    if (filters.workShopNo) {
      conditions.push({ workShopNo: { contains: filters.workShopNo } });
    }

    // Discipline
    if (filters.discipline) {
      conditions.push({ discId: filters.discipline.discId });
    }

    // Person In Charge
    if (filters.personInCharge) {
      conditions.push({ personInChargeId: filters.personInCharge.employeeId });
    }

    // Person In Charge Approve
    if (filters.personInChargeApprove) {
      conditions.push({
        personInChargeApproveId: filters.personInChargeApprove.employeeId,
      });
    }

    // Awarding Date range
    if (filters.awardingDateFrom && filters.awardingDateTo) {
      conditions.push({
        awardingDate: {
          gte: new Date(filters.awardingDateFrom),
          lte: new Date(filters.awardingDateTo),
        },
      });
    } else if (filters.awardingDateFrom) {
      conditions.push({
        awardingDate: { gte: new Date(filters.awardingDateFrom) },
      });
    } else if (filters.awardingDateTo) {
      conditions.push({
        awardingDate: { lte: new Date(filters.awardingDateTo) },
      });
    }

    // Created Date range
    if (filters.createdDateFrom && filters.createdDateTo) {
      conditions.push({
        createdDate: {
          gte: new Date(filters.createdDateFrom),
          lte: new Date(filters.createdDateTo),
        },
      });
    } else if (filters.createdDateFrom) {
      conditions.push({
        createdDate: { gte: new Date(filters.createdDateFrom) },
      });
    } else if (filters.createdDateTo) {
      conditions.push({
        createdDate: { lte: new Date(filters.createdDateTo) },
      });
    }

    const prismaFilter: WorkShopFilter = {
      AND: conditions.length > 0 ? conditions : undefined,
    };

    onSubmit(prismaFilter);
    onClose();
  };

  const handleClear = () => {
    const cleared = getDefaultFilters();

    setFilters(cleared);

    const prismaFilter: WorkShopFilter = {
      AND: undefined,
    };

    onSubmit(prismaFilter);
    onClose();
  };

  const set = <K extends keyof FiltersState>(key: K, value: FiltersState[K]) =>
    setFilters((p) => ({ ...p, [key]: value }));

  return (
    <FormDialog
      open={open}
      title="Filter WorkShop"
      submitText="Ok"
      cancelText="Default"
      onClose={onClose}
      onSubmit={(e) => {
        e.preventDefault();
        handleApply();
      }}
      onCancelClick={handleClear}
    >
      {/* Open / Closed / All */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        fontWeight="bold"
        marginBottom={1}
      >
        WorkShop State
        <RadioGroup
          row
          sx={{ gap: 1.5 }}
          value={filters.statusMode}
          onChange={(e) =>
            set("statusMode", e.target.value as FiltersState["statusMode"])
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

      <Box display="flex" flexDirection="column" gap={1.5}>
        {/* WorkShop No */}
        <TextField
          label="WorkShop No"
          size="small"
          value={filters.workShopNo}
          onChange={(e) => set("workShopNo", e.target.value)}
        />

        {/* Discipline */}
        <FieldAsyncSelect<TypeTblDiscipline>
          label="Discipline"
          request={tblDiscipline.getAll}
          value={filters.discipline}
          getOptionKey={(r) => r.discId}
          getOptionLabel={(r) => r.name ?? ""}
          onChange={(v) => set("discipline", v as TypeTblDiscipline | null)}
        />

        {/* Person In Charge + Approve */}
        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1.5}>
          <FieldAsyncSelectGrid<TypeTblEmployee>
            label="Person In Charge"
            request={tblEmployee.getAll}
            value={filters.personInCharge}
            columns={[
              { field: "firstName", headerName: "FirstName", flex: 1 },
              { field: "lastName", headerName: "LastName", flex: 1 },
            ]}
            getRowId={(r) => r.employeeId}
            getOptionLabel={(r) => extractFullName(r) ?? ""}
            onChange={(v) => set("personInCharge", v as TypeTblEmployee | null)}
          />
          <FieldAsyncSelectGrid<TypeTblEmployee>
            label="ToolPusher"
            request={tblEmployee.getAll}
            value={filters.personInChargeApprove}
            columns={[
              { field: "firstName", headerName: "FirstName", flex: 1 },
              { field: "lastName", headerName: "LastName", flex: 1 },
            ]}
            getRowId={(r) => r.employeeId}
            getOptionLabel={(r) => extractFullName(r) ?? ""}
            onChange={(v) =>
              set("personInChargeApprove", v as TypeTblEmployee | null)
            }
          />
        </Box>

        {/* Awarding Date Range */}
        <Box>
          <Box sx={{ fontSize: 12, color: "text.secondary", mb: 0.5 }}>
            Awarding Date
          </Box>
          <Box display="flex" gap={1.5}>
            <FieldDateTime
              type="DATE"
              label="From"
              field={{
                value: filters.awardingDateFrom,
                onChange: (v: string) => set("awardingDateFrom", v),
              }}
            />
            <FieldDateTime
              type="DATE"
              label="To"
              field={{
                value: filters.awardingDateTo,
                onChange: (v: string) => set("awardingDateTo", v),
              }}
            />
          </Box>
        </Box>

        {/* Created Date Range */}
        <Box>
          <Box sx={{ fontSize: 12, color: "text.secondary", mb: 0.5 }}>
            Created Date
          </Box>
          <Box display="flex" gap={1.5}>
            <FieldDateTime
              type="DATE"
              label="From"
              field={{
                value: filters.createdDateFrom,
                onChange: (v: string) => set("createdDateFrom", v),
              }}
            />
            <FieldDateTime
              type="DATE"
              label="To"
              field={{
                value: filters.createdDateTo,
                onChange: (v: string) => set("createdDateTo", v),
              }}
            />
          </Box>
        </Box>
      </Box>
    </FormDialog>
  );
}
