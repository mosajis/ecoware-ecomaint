import FormDialog from "@/shared/components/formDialog/FormDialog";
import React, { useState, useRef } from "react";
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
  TypeTblComponentUnit,
  TypeTblCompType,
  TypeTblMaintClass,
  TypeTblMaintType,
  TypeTblPendingType,
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

interface CheckboxGroupProps {
  title: string;
  items: string[];
  selected?: string[];
  onChange: (value: string) => void;
}

const CheckboxGroup = React.memo(
  ({ title, items, selected = [], onChange }: CheckboxGroupProps) => (
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
  )
);

export interface WorkOrderFilter {
  AND?: any[];
}

interface WorkOrderFilterDialogProps {
  open: boolean;
  onClose: () => void;
  onApplyFilter: (filter: WorkOrderFilter | null) => void;
}

type FiltersState = {
  number: string;
  title: string;
  jobCode: string;
  priority: string;
  component: TypeTblComponentUnit | null;
  componentType: TypeTblCompType | null;
  maintType: TypeTblMaintType | null;
  maintClass: TypeTblMaintClass | null;
  pendingType: TypeTblPendingType | null;
  workOrderStatuses: string[];
  componentStatuses: string[];
  responsibilities: string[];
  dueNow: boolean;
  overDue: boolean;
  dueThisWeek: boolean;
  dueNextWeek: boolean;
  dueFrom: string;
  dueTo: string;
  criticalComponent: boolean;
};

export default function WorkOrderFilterDialog({
  open,
  onClose,
  onApplyFilter,
}: WorkOrderFilterDialogProps) {
  const [filters, setFilters] = useState<FiltersState>({
    number: "",
    title: "",
    jobCode: "",
    priority: "",
    component: null,
    componentType: null,
    maintType: null,
    maintClass: null,
    pendingType: null,
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

  // فقط text inputs به ref احتیاج دارند
  const textInputRefs = useRef({
    number: "",
    title: "",
    jobCode: "",
    priority: "",
    dueFrom: "",
    dueTo: "",
  });

  const handleApply = () => {
    // پس از apply، ref ها رو تو state sync کن
    const textValues = textInputRefs.current;

    const conditions: any[] = [];

    if (textValues.number) {
      conditions.push({
        woNo: { contains: textValues.number, mode: "insensitive" },
      });
    }

    if (textValues.title) {
      conditions.push({
        title: { contains: textValues.title, mode: "insensitive" },
      });
    }

    if (textValues.jobCode) {
      conditions.push({
        tblCompJob: {
          tblJobDescription: {
            jobDescCode: { contains: textValues.jobCode },
          },
        },
      });
    }

    if (textValues.priority) {
      conditions.push({ priority: parseInt(textValues.priority) });
    }

    if (filters.component) {
      conditions.push({ compId: filters.component.compId });
    }

    if (filters.componentType) {
      conditions.push({
        tblComponentUnit: {
          tblCompType: {
            compTypeId: filters.componentType.compTypeId,
          },
        },
      });
    }

    if (filters.maintType) {
      conditions.push({
        maintTypeId: filters.maintType.maintTypeId,
      });
    }

    if (filters.maintClass) {
      conditions.push({
        maintClassId: filters.maintClass.maintClassId,
      });
    }

    if (filters.pendingType) {
      conditions.push({
        pendTypeId: filters.pendingType.pendTypeId,
      });
    }

    if (filters.workOrderStatuses.length > 0) {
      conditions.push({
        tblWorkOrderStatus: {
          name: { in: filters.workOrderStatuses },
        },
      });
    }

    if (filters.componentStatuses.length > 0) {
      conditions.push({
        tblComponentUnit: {
          tblCompStatus: {
            compStatusName: {
              in: filters.componentStatuses,
            },
          },
        },
      });
    }

    if (filters.responsibilities.length > 0) {
      conditions.push({
        tblDiscipline: {
          name: { in: filters.responsibilities },
        },
      });
    }

    if (filters.dueNow) {
      const today = new Date().toISOString().split("T")[0];
      conditions.push({
        dueDate: {
          gte: new Date(today),
          lt: new Date(new Date(today).getTime() + 86400000),
        },
      });
    }

    if (filters.overDue) {
      const today = new Date().toISOString().split("T")[0];
      conditions.push({
        dueDate: { lt: new Date(today) },
      });
    }

    if (filters.dueThisWeek) {
      const today = new Date();
      const dayOfWeek = today.getDay();
      const startOfWeek = new Date(today.setDate(today.getDate() - dayOfWeek));
      const endOfWeek = new Date(
        today.setDate(today.getDate() - dayOfWeek + 6)
      );
      conditions.push({
        dueDate: { gte: startOfWeek, lte: endOfWeek },
      });
    }

    if (filters.dueNextWeek) {
      const today = new Date();
      const dayOfWeek = today.getDay();
      const startOfNextWeek = new Date(
        today.setDate(today.getDate() - dayOfWeek + 7)
      );
      const endOfNextWeek = new Date(
        today.setDate(today.getDate() - dayOfWeek + 13)
      );
      conditions.push({
        dueDate: { gte: startOfNextWeek, lte: endOfNextWeek },
      });
    }

    if (textValues.dueFrom && textValues.dueTo) {
      conditions.push({
        dueDate: {
          gte: new Date(textValues.dueFrom),
          lte: new Date(textValues.dueTo),
        },
      });
    }

    if (filters.criticalComponent) {
      conditions.push({
        tblComponentUnit: {
          critical: true,
        },
      });
    }

    const prismaFilter: WorkOrderFilter = {
      AND: conditions.length > 0 ? conditions : undefined,
    };

    onApplyFilter(prismaFilter);
    onClose();
  };

  const handleClearFilter = () => {
    setFilters({
      number: "",
      title: "",
      jobCode: "",
      priority: "",
      component: null,
      componentType: null,
      maintType: null,
      maintClass: null,
      pendingType: null,
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

    textInputRefs.current = {
      number: "",
      title: "",
      jobCode: "",
      priority: "",
      dueFrom: "",
      dueTo: "",
    };
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleApply();
  };

  const handleOnClose = () => {
    handleClearFilter();
    onApplyFilter(null);
    onClose();
  };

  // plan issue pend
  // due now
  // over due

  return (
    <FormDialog
      open={open}
      title="Filter"
      maxWidth="md"
      onClose={handleOnClose}
      onSubmit={handleSubmit}
      submitText="Ok"
      cancelText="Clear"
    >
      <Box display="flex" gap={1.5} flexDirection="column">
        <Box>
          <Box sx={{ fontWeight: "bold" }} pb={1}>
            Work Order Info
          </Box>
          <Box
            display="grid"
            gap={1.5}
            width="100%"
            gridTemplateColumns="1fr 1fr 1fr"
          >
            <Box display="flex" flexDirection="column" gap={1.5}>
              <TextField
                fullWidth
                size="small"
                label="Number"
                name="number"
                defaultValue={textInputRefs.current.number}
                onChange={(e) => {
                  textInputRefs.current.number = e.target.value;
                }}
                // InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                size="small"
                label="Title"
                name="title"
                defaultValue={textInputRefs.current.title}
                onChange={(e) => {
                  textInputRefs.current.title = e.target.value;
                }}
                // InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                size="small"
                label="Job Code"
                name="jobCode"
                defaultValue={textInputRefs.current.jobCode}
                onChange={(e) => {
                  textInputRefs.current.jobCode = e.target.value;
                }}
                // InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                type="number"
                size="small"
                label="Priority"
                name="priority"
                defaultValue={textInputRefs.current.priority}
                onChange={(e) => {
                  textInputRefs.current.priority = e.target.value;
                }}
                // InputLabelProps={{ shrink: true }}
              />
            </Box>

            <Box display="flex" gap={1.5} flexDirection="column">
              <AsyncSelectField
                value={filters.component}
                dialogMaxWidth="sm"
                label="Component"
                selectionMode="single"
                request={tblComponentUnit.getAll}
                columns={[{ field: "compNo", headerName: "Name", flex: 1 }]}
                getRowId={(row) => row.compId}
                getOptionLabel={(row) => row.compNo}
                onChange={(value) => {
                  setFilters((prev) => ({
                    ...prev,
                    component: value as TypeTblComponentUnit | null,
                  }));
                }}
              />
              <AsyncSelectField
                value={filters.componentType}
                dialogMaxWidth="sm"
                label="Component Type"
                selectionMode="single"
                request={tblCompType.getAll}
                columns={[
                  { field: "compName", headerName: "compName", flex: 1 },
                  { field: "compType", headerName: "compType", flex: 1 },
                  { field: "compTypeNo", headerName: "compTypeNo", flex: 1 },
                ]}
                getRowId={(row) => row.compTypeId}
                getOptionLabel={(row) => row.compTypeNo}
                onChange={(value) => {
                  setFilters((prev) => ({
                    ...prev,
                    componentType: value as TypeTblCompType | null,
                  }));
                }}
              />
            </Box>

            <Box display="flex" gap={1.5} flexDirection="column">
              <AsyncSelectField
                value={filters.maintType}
                dialogMaxWidth="sm"
                label="Maint Type"
                selectionMode="single"
                request={tblMaintType.getAll}
                columns={[{ field: "descr", headerName: "Name", flex: 1 }]}
                getRowId={(row) => row.maintTypeId}
                onChange={(value) => {
                  setFilters((prev) => ({
                    ...prev,
                    maintType: value as TypeTblMaintType | null,
                  }));
                }}
              />
              <AsyncSelectField
                value={filters.maintClass}
                dialogMaxWidth="sm"
                label="Maint Class"
                selectionMode="single"
                request={tblMaintClass.getAll}
                columns={[{ field: "descr", headerName: "Name", flex: 1 }]}
                getRowId={(row) => row.maintClassId}
                onChange={(value) => {
                  setFilters((prev) => ({
                    ...prev,
                    maintClass: value as TypeTblMaintClass | null,
                  }));
                }}
              />
              <AsyncSelectField
                value={filters.pendingType}
                dialogMaxWidth="sm"
                label="Pending Type"
                selectionMode="single"
                getOptionLabel={(row) => row.pendTypeName}
                request={tblPendingType.getAll}
                columns={[
                  { field: "pendTypeName", headerName: "Name", flex: 1 },
                ]}
                getRowId={(row) => row.pendTypeId}
                onChange={(value) => {
                  setFilters((prev) => ({
                    ...prev,
                    pendingType: value as TypeTblPendingType | null,
                  }));
                }}
              />
            </Box>
          </Box>
        </Box>

        <Divider />

        <Box sx={{ display: "flex", gap: 1.5 }}>
          <CheckboxGroup
            title="Resp. Discipline"
            items={RESPONSIBILITIES}
            selected={filters.responsibilities}
            onChange={(v) => {
              setFilters((prev) => {
                const current = prev.responsibilities;
                const isChecked = current.includes(v);
                return {
                  ...prev,
                  responsibilities: isChecked
                    ? current.filter((item) => item !== v)
                    : [...current, v],
                };
              });
            }}
          />

          <Divider orientation="vertical" flexItem />

          <CheckboxGroup
            title="WorkOrder Status"
            items={WORKORDER_STATUSES}
            selected={filters.workOrderStatuses}
            onChange={(v) => {
              setFilters((prev) => {
                const current = prev.workOrderStatuses;
                const isChecked = current.includes(v);
                return {
                  ...prev,
                  workOrderStatuses: isChecked
                    ? current.filter((item) => item !== v)
                    : [...current, v],
                };
              });
            }}
          />

          <Divider orientation="vertical" flexItem />

          <CheckboxGroup
            title="Component Status"
            items={COMPONENT_STATUSES}
            selected={filters.componentStatuses}
            onChange={(v) => {
              setFilters((prev) => {
                const current = prev.componentStatuses;
                const isChecked = current.includes(v);
                return {
                  ...prev,
                  componentStatuses: isChecked
                    ? current.filter((item) => item !== v)
                    : [...current, v],
                };
              });
            }}
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
                      checked={filters[key as keyof typeof filters] as boolean}
                      onChange={() => {
                        setFilters((prev) => ({
                          ...prev,
                          [key]: !prev[key as keyof typeof filters],
                        }));
                      }}
                    />
                  }
                  label={label}
                />
              ))}
            </FormGroup>

            <Box
              sx={{ display: "flex", gap: 1, flexDirection: "column", mt: 1 }}
            >
              <Typography variant="body2" fontWeight="bold">
                Due Between
              </Typography>

              <Box display="flex" gap={1.5} alignItems="center">
                <TextField
                  type="date"
                  size="small"
                  name="dueFrom"
                  defaultValue={textInputRefs.current.dueFrom}
                  onChange={(e) => {
                    textInputRefs.current.dueFrom = e.target.value;
                  }}
                  // InputLabelProps={{ shrink: true }}
                />
                <Typography>-</Typography>
                <TextField
                  type="date"
                  size="small"
                  name="dueTo"
                  defaultValue={textInputRefs.current.dueTo}
                  onChange={(e) => {
                    textInputRefs.current.dueTo = e.target.value;
                  }}
                  // InputLabelProps={{ shrink: true }}
                />
              </Box>
            </Box>

            <FormControlLabel
              sx={{ height: "1.7rem", mt: 1 }}
              control={
                <Checkbox
                  size="small"
                  checked={filters.criticalComponent}
                  onChange={() => {
                    setFilters((prev) => ({
                      ...prev,
                      criticalComponent: !prev.criticalComponent,
                    }));
                  }}
                />
              }
              label="Critical Component"
            />
          </Box>
        </Box>
      </Box>
    </FormDialog>
  );
}
