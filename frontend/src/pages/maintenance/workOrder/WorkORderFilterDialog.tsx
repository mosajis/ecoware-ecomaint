import FormDialog from "@/shared/components/formDialog/FormDialog";
import React, { useState } from "react";
import {
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import { AsyncSelectField } from "@/shared/components/AsyncSelectField";
import {
  tblComponentUnit,
  tblCompType,
  tblMaintClass,
  tblMaintType,
  tblPendingType,
} from "@/core/api/generated/api";

const RESPONSIBILITIES = [
  "Electrician",
  "Mechanic",
  "Toolpusher",
  "BargeMaster",
  "HSE Officer",
  "ENG",
  "Technical Inspection",
  "PM",
  "IT",
  "Instruction",
  "Doctor",
  "ENG-KISH",
];

const WORKORDER_STATUSES = [
  "Planned",
  "Issued",
  "Pending",
  "Completed",
  "Controlled",
  "Canceled",
  "Postponed",
];

const COMPONENT_STATUSES = [
  "None",
  "InUse",
  "Available",
  "Repair",
  "Scrapped",
  "Transferred",
];

interface AsyncSelectProps {
  label: string;
  request: any;
}

const AsyncSelect = ({ label, request }: AsyncSelectProps) => (
  <AsyncSelectField
    dialogMaxWidth="sm"
    label={label}
    selectionMode="single"
    request={request}
    columns={[{ field: "name", headerName: "Name", flex: 1 }]}
    getRowId={(row) => row.compId}
    onChange={() => {}}
  />
);

interface CheckboxGroupProps {
  title: string;
  items: string[];
  selected?: string[];
  onChange: (value: string) => void;
}

const CheckboxGroup = ({
  title,
  items,
  selected = [],
  onChange,
}: CheckboxGroupProps) => (
  <Box>
    <Box sx={{ fontWeight: "bold" }} pb={1}>
      {title}
    </Box>
    <FormGroup>
      {items.map((item) => (
        <FormControlLabel
          key={item}
          sx={{ height: "1.7rem" }}
          control={
            <Checkbox
              size="small"
              checked={selected.includes(item)}
              onChange={() => onChange(item)}
            />
          }
          label={item}
        />
      ))}
    </FormGroup>
  </Box>
);
export interface WorkOrderFilter {
  number?: string;
  title?: string;
  jobCode?: string;
  priority?: number;
  component?: string;
  componentClass?: string;
  componentType?: string;
  pendingType?: string;
  maintType?: string;
  maintClass?: string;
  workOrderStatuses?: string[];
  componentStatuses?: string[];
  responsibilities?: string[];
  dueNow?: boolean;
  overDue?: boolean;
  dueThisWeek?: boolean;
  dueNextWeek?: boolean;
  dueFrom?: string;
  dueTo?: string;
  criticalComponent?: boolean;
}

interface WorkOrderFilterDialogProps {
  open: boolean;
  onClose: () => void;
  onApplyFilter: (filter: WorkOrderFilter) => void;
}

export default function WorkOrderFilterDialog({
  open,
  onClose,
  onApplyFilter,
}: WorkOrderFilterDialogProps) {
  const [filters, setFilters] = useState<WorkOrderFilter>({
    number: "",
    title: "",
    jobCode: "",
    priority: undefined,
    component: "",
    componentClass: "",
    componentType: "",
    pendingType: "",
    maintType: "",
    maintClass: "",
    workOrderStatuses: [],
    componentStatuses: [],
    responsibilities: [],
    dueNow: false,
    overDue: false,
    dueThisWeek: false,
    dueNextWeek: false,
    dueFrom: "",
    dueTo: "",
    criticalComponent: false,
  });

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value === "" ? undefined : value,
    }));
  };

  const handleCheckboxChange = (name: string) => {
    setFilters((prev) => ({
      ...prev,
      [name]: !prev[name as keyof WorkOrderFilter],
    }));
  };

  const handleMultiCheckboxChange = (name: string, value: string) => {
    setFilters((prev) => {
      const current = Array.isArray(prev[name as keyof WorkOrderFilter])
        ? (prev[name as keyof WorkOrderFilter] as string[])
        : [];
      const isChecked = current.includes(value);
      return {
        ...prev,
        [name]: isChecked
          ? current.filter((item) => item !== value)
          : [...current, value],
      };
    });
  };

  const handleApply = () => {
    const prismaFilter: any = {
      AND: [
        filters.number && {
          number: { contains: filters.number, mode: "insensitive" },
        },
        filters.title && {
          title: { contains: filters.title, mode: "insensitive" },
        },
        filters.jobCode && {
          jobCode: { contains: filters.jobCode, mode: "insensitive" },
        },
        filters.priority !== undefined && { priority: filters.priority },
        filters.component && {
          component: { contains: filters.component, mode: "insensitive" },
        },
        filters.componentClass && {
          componentClass: {
            contains: filters.componentClass,
            mode: "insensitive",
          },
        },
        filters.componentType && {
          componentType: {
            contains: filters.componentType,
            mode: "insensitive",
          },
        },
        filters.pendingType && {
          pendingType: { contains: filters.pendingType, mode: "insensitive" },
        },
        filters.maintType && {
          maintType: { contains: filters.maintType, mode: "insensitive" },
        },
        filters.maintClass && {
          maintClass: { contains: filters.maintClass, mode: "insensitive" },
        },
        filters.workOrderStatuses?.length && {
          status: { in: filters.workOrderStatuses },
        },
        filters.componentStatuses?.length && {
          componentStatus: { in: filters.componentStatuses },
        },
        filters.responsibilities?.length && {
          responsibility: { in: filters.responsibilities },
        },
        filters.dueNow && {
          dueDate: { equals: new Date().toISOString().split("T")[0] },
        },
        filters.overDue && {
          dueDate: { lt: new Date().toISOString().split("T")[0] },
        },
        filters.dueFrom &&
          filters.dueTo && {
            dueDate: { gte: filters.dueFrom, lte: filters.dueTo },
          },
        filters.criticalComponent && { criticalComponent: true },
      ].filter(Boolean),
    };

    onApplyFilter(prismaFilter);
    onClose();
  };

  const handleClearFilter = () => {
    setFilters({
      number: "",
      title: "",
      jobCode: "",
      priority: undefined,
      component: "",
      componentClass: "",
      componentType: "",
      pendingType: "",
      maintType: "",
      maintClass: "",
      workOrderStatuses: [],
      componentStatuses: [],
      responsibilities: [],
      dueNow: false,
      overDue: false,
      dueThisWeek: false,
      dueNextWeek: false,
      dueFrom: "",
      dueTo: "",
      criticalComponent: false,
    });
  };

  return (
    <FormDialog open={open} onClose={onClose} title="Filter" maxWidth="md">
      <Box display="flex" gap={1.5}>
        <Box>
          <Box sx={{ fontWeight: "bold" }} pb={1}>
            WorkOrder Info
          </Box>

          <Box
            display={"grid"}
            gap={1.5}
            width={"100%"}
            gridTemplateColumns={"1fr 1fr 1fr"}
          >
            <Box display={"flex"} flexDirection={"column"} gap={1.5}>
              <TextField
                fullWidth
                size="small"
                label="Number"
                name="number"
                value={filters.number}
                onChange={handleTextChange}
              />
              <TextField
                size="small"
                label="Title"
                name="title"
                value={filters.title}
                onChange={handleTextChange}
              />
              <TextField
                size="small"
                label="Job Code"
                name="jobCode"
                value={filters.jobCode}
                onChange={handleTextChange}
              />
              <TextField
                type="number"
                size="small"
                label="Priority"
                name="priority"
                value={filters.priority}
                onChange={handleTextChange}
              />
            </Box>

            <Box display={"flex"} gap={1.5} flexDirection={"column"}>
              <AsyncSelect
                label="Component"
                request={tblComponentUnit.getAll}
              />
              <AsyncSelect
                label="Component Type"
                request={tblCompType.getAll}
              />
              <AsyncSelect
                label="Component Class"
                request={tblComponentUnit.getAll}
              />
            </Box>
            <Box display={"flex"} gap={1.5} flexDirection={"column"}>
              <AsyncSelect label="Maint Type" request={tblMaintType.getAll} />
              <AsyncSelect label="Maint Class" request={tblMaintClass.getAll} />
              <AsyncSelect
                label="Pending Type"
                request={tblPendingType.getAll}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ my: 1.5 }} />

      <Box sx={{ display: "flex", gap: 1.5 }}>
        <CheckboxGroup
          title="Resp. Discipline"
          items={RESPONSIBILITIES}
          selected={filters.responsibilities}
          onChange={(v) => handleMultiCheckboxChange("responsibilities", v)}
        />

        <Divider orientation="vertical" flexItem />

        <CheckboxGroup
          title="WorkOrder Status"
          items={WORKORDER_STATUSES}
          selected={filters.workOrderStatuses}
          onChange={(v) => handleMultiCheckboxChange("workOrderStatuses", v)}
        />

        <Divider orientation="vertical" flexItem />

        <CheckboxGroup
          title="Component Status"
          items={COMPONENT_STATUSES}
          selected={filters.componentStatuses}
          onChange={(v) => handleMultiCheckboxChange("componentStatuses", v)}
        />

        <Divider orientation="vertical" flexItem />

        <Box>
          <Box sx={{ fontWeight: "bold" }} pb={1}>
            Planning
          </Box>

          <FormGroup>
            {[
              { key: "dueNow", label: "Due Now" },
              { key: "overDue", label: "Over due" },
              { key: "dueThisWeek", label: "Due This Week" },
              { key: "dueNextWeek", label: "Due next week" },
            ].map(({ key, label }) => (
              <FormControlLabel
                key={key}
                sx={{ height: "1.7rem" }}
                control={
                  <Checkbox
                    size="small"
                    checked={filters[key as keyof typeof filters] ?? false}
                    onChange={() => handleCheckboxChange(key)}
                  />
                }
                label={label}
              />
            ))}
          </FormGroup>

          <Box sx={{ display: "flex", gap: 1, flexDirection: "column", mt: 1 }}>
            <Typography variant="body2" fontWeight="bold">
              Due Between
            </Typography>

            <Box display="flex" gap={1.5} alignItems="center">
              <TextField
                type="date"
                size="small"
                name="dueFrom"
                value={filters.dueFrom}
                onChange={handleTextChange}
              />
              <Typography>-</Typography>
              <TextField
                type="date"
                size="small"
                name="dueTo"
                value={filters.dueTo}
                onChange={handleTextChange}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </FormDialog>
  );
}
