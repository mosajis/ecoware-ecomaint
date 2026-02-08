import FormDialog from "@/shared/components/formDialog/FormDialog";
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import FieldAsyncSelectGrid from "@/shared/components/fields/FieldAsyncSelectGrid";
import FieldDateTime from "@/shared/components/fields/FieldDateTime";
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
import { useAtomValue } from "jotai";
import { atomUser } from "@/pages/auth/auth.atom";

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
  "Plan",
  "Issue",
  "Pend",
  "Complete",
  "Control",
  "Cancel",
  "Postponed",
];

const COMPONENT_STATUSES = [
  "None",
  "InUse",
  "Available",
  "Repair",
  "Scrapped",
  "Transfered",
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
  ),
);

export interface WorkOrderFilter {
  AND?: any[];
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

interface WorkOrderFilterDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (filter: WorkOrderFilter | null) => void;
  initialFilters?: Partial<FiltersState>; // 🔹 اضافه شد برای دریافت فیلترهای اولیه
}

export default function WorkOrderFilterDialog({
  open,
  onClose,
  onSubmit,
  initialFilters, // 🔹 اضافه شد
}: WorkOrderFilterDialogProps) {
  const user = useAtomValue(atomUser);

  const userDisipline =
    // @ts-ignore
    user?.tblEmployeeTblUsersEmployeeIdTotblEmployee?.tblDiscipline?.name;

  const defaultDiscipline =
    userDisipline && RESPONSIBILITIES.includes(userDisipline)
      ? [userDisipline]
      : [];

  // 🔹 تابع برای ساخت مقادیر پیش‌فرض با در نظر گرفتن initialFilters
  const getDefaultFilters = (): FiltersState => ({
    number: "",
    title: "",
    jobCode: "",
    priority: "",
    component: null,
    componentType: null,
    maintType: null,
    maintClass: null,
    pendingType: null,
    workOrderStatuses: ["Plan", "Issue", "Pend"],
    componentStatuses: ["None", "InUse", "Available", "Repair"],
    responsibilities: defaultDiscipline,
    dueNow: true,
    overDue: true,
    dueThisWeek: false,
    dueNextWeek: false,
    dueFrom: "",
    dueTo: "",
    criticalComponent: false,
    ...initialFilters, // 🔹 اعمال مقادیر اولیه از parent
  });

  // 🔹 استفاده از controlled state به جای ref
  const [filters, setFilters] = useState<FiltersState>(getDefaultFilters());

  const handleApply = () => {
    const conditions: any[] = [];

    // 🔹 استفاده مستقیم از filters.number به جای textInputRefs
    if (filters.number) {
      conditions.push({
        woNo: { contains: filters.number, mode: "insensitive" },
      });
    }

    if (filters.title) {
      conditions.push({
        title: { contains: filters.title, mode: "insensitive" },
      });
    }

    if (filters.jobCode) {
      conditions.push({
        tblCompJob: {
          tblJobDescription: {
            jobDescCode: { contains: filters.jobCode },
          },
        },
      });
    }

    if (filters.priority) {
      conditions.push({ priority: parseInt(filters.priority) });
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

    const dueConditions: any[] = [];
    const today = new Date(new Date().toISOString().split("T")[0]);

    if (filters.dueNow) {
      dueConditions.push({
        dueDate: {
          gte: today,
          lt: new Date(today.getTime() + 86400000),
        },
      });
    }

    if (filters.overDue) {
      dueConditions.push({
        dueDate: { lt: today },
      });
    }

    if (dueConditions.length > 0) {
      conditions.push({
        OR: dueConditions,
      });
    }

    if (filters.dueThisWeek) {
      const today = new Date();
      const dayOfWeek = today.getDay();
      const startOfWeek = new Date(today.setDate(today.getDate() - dayOfWeek));
      const endOfWeek = new Date(
        today.setDate(today.getDate() - dayOfWeek + 6),
      );
      conditions.push({
        dueDate: { gte: startOfWeek, lte: endOfWeek },
      });
    }

    if (filters.dueNextWeek) {
      const today = new Date();
      const dayOfWeek = today.getDay();
      const startOfNextWeek = new Date(
        today.setDate(today.getDate() - dayOfWeek + 7),
      );
      const endOfNextWeek = new Date(
        today.setDate(today.getDate() - dayOfWeek + 13),
      );
      conditions.push({
        dueDate: { gte: startOfNextWeek, lte: endOfNextWeek },
      });
    }

    if (filters.dueFrom && filters.dueTo) {
      conditions.push({
        dueDate: {
          gte: new Date(filters.dueFrom),
          lte: new Date(filters.dueTo),
        },
      });
    }

    if (filters.criticalComponent) {
      conditions.push({
        tblComponentUnit: {
          isCritical: 1,
        },
      });
    }

    const prismaFilter: WorkOrderFilter = {
      AND: conditions.length > 0 ? conditions : undefined,
    };

    onSubmit(prismaFilter);
    onClose();
  };

  const handleClearFilter = () => {
    setFilters(getDefaultFilters());
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleApply();
  };

  const handleOnClose = () => {
    // 🔹 فقط مودال رو می‌بنده، state رو نمی‌زنه
    onClose();
  };

  return (
    <FormDialog
      open={open}
      title="Filter"
      maxWidth="md"
      onClose={handleOnClose}
      onSubmit={handleSubmit}
      submitText="Ok"
      cancelText="Clear"
      onCancelClick={handleClearFilter} // 🔹 دکمه Clear فیلترها رو پاک می‌کنه
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
              {/* 🔹 تبدیل به controlled input */}
              <TextField
                fullWidth
                size="small"
                label="Number"
                name="number"
                value={filters.number}
                onChange={(e) => {
                  setFilters((prev) => ({ ...prev, number: e.target.value }));
                }}
              />
              <TextField
                fullWidth
                size="small"
                label="Title"
                name="title"
                value={filters.title}
                onChange={(e) => {
                  setFilters((prev) => ({ ...prev, title: e.target.value }));
                }}
              />
              <TextField
                fullWidth
                size="small"
                label="Job Code"
                name="jobCode"
                value={filters.jobCode}
                onChange={(e) => {
                  setFilters((prev) => ({ ...prev, jobCode: e.target.value }));
                }}
              />
              <TextField
                fullWidth
                type="number"
                size="small"
                label="Priority"
                name="priority"
                value={filters.priority}
                onChange={(e) => {
                  setFilters((prev) => ({
                    ...prev,
                    priority: e.target.value,
                  }));
                }}
              />
            </Box>

            <Box display="flex" gap={1.5} flexDirection="column">
              <FieldAsyncSelectGrid
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
              <FieldAsyncSelectGrid
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
              <FieldAsyncSelectGrid
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
              <FieldAsyncSelectGrid
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
              <FieldAsyncSelectGrid
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

        <Divider />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1.5fr auto 1fr auto 1.2fr auto auto ",
            gap: 1.5,
          }}
        >
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

              <Box display="flex" gap={1.5} alignItems="center" width={400}>
                {/* 🔹 استفاده از FieldDateTime */}
                <FieldDateTime
                  type="DATE"
                  label="From"
                  field={{
                    value: filters.dueFrom,
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                      setFilters((prev) => ({
                        ...prev,
                        dueFrom: e.target.value,
                      }));
                    },
                  }}
                />
                <Typography>-</Typography>
                <FieldDateTime
                  type="DATE"
                  label="To"
                  field={{
                    value: filters.dueTo,
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                      setFilters((prev) => ({
                        ...prev,
                        dueTo: e.target.value,
                      }));
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </FormDialog>
  );
}
