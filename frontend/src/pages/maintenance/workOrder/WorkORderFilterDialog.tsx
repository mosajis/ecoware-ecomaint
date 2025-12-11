import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Grid,
  Typography,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

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

const PRIORITY_OPTIONS = [0, 1, 2, 3, 4, 5];

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
    // ساخت filter object برای prisma
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
        filters.workOrderStatuses &&
          filters.workOrderStatuses.length > 0 && {
            status: { in: filters.workOrderStatuses },
          },
        filters.componentStatuses &&
          filters.componentStatuses.length > 0 && {
            componentStatus: { in: filters.componentStatuses },
          },
        filters.responsibilities &&
          filters.responsibilities.length > 0 && {
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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>فیلتر کردن Work Order</DialogTitle>
      <DialogContent dividers sx={{ maxHeight: "70vh", overflowY: "auto" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 2 }}>
          {/* Filter Work Order Section */}
          <Paper elevation={0} sx={{ p: 2, bgcolor: "#f5f5f5" }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold" }}>
              فیلتر Work Order
            </Typography>
            <Grid container spacing={2}>
              <TextField
                fullWidth
                size="small"
                label="شماره"
                name="number"
                value={filters.number}
                onChange={handleTextChange}
                variant="outlined"
              />
              <TextField
                fullWidth
                size="small"
                label="عنوان"
                name="title"
                value={filters.title}
                onChange={handleTextChange}
                variant="outlined"
              />
              <TextField
                fullWidth
                size="small"
                label="Job Code"
                name="jobCode"
                value={filters.jobCode}
                onChange={handleTextChange}
                variant="outlined"
              />
              <FormControl fullWidth size="small">
                <InputLabel>اولویت</InputLabel>
                <Select
                  name="priority"
                  value={filters.priority ?? ""}
                  onChange={handleSelectChange}
                  label="اولویت"
                >
                  <MenuItem value="">همه</MenuItem>
                  {PRIORITY_OPTIONS.map((p) => (
                    <MenuItem key={p} value={p}>
                      {p}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Paper>

          {/* Component Section */}
          <Paper elevation={0} sx={{ p: 2, bgcolor: "#f5f5f5" }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold" }}>
              کامپوننت
            </Typography>
            <TextField
              fullWidth
              size="small"
              label="کامپوننت"
              name="component"
              value={filters.component}
              onChange={handleTextChange}
              variant="outlined"
            />
            <TextField
              fullWidth
              size="small"
              label="Component Class"
              name="componentClass"
              value={filters.componentClass}
              onChange={handleTextChange}
              variant="outlined"
            />
            <TextField
              fullWidth
              size="small"
              label="Component Type"
              name="componentType"
              value={filters.componentType}
              onChange={handleTextChange}
              variant="outlined"
            />
            <TextField
              fullWidth
              size="small"
              label="Pending Type"
              name="pendingType"
              value={filters.pendingType}
              onChange={handleTextChange}
              variant="outlined"
            />
            <TextField
              fullWidth
              size="small"
              label="Maint Type"
              name="maintType"
              value={filters.maintType}
              onChange={handleTextChange}
              variant="outlined"
            />
            <TextField
              fullWidth
              size="small"
              label="Maint Class"
              name="maintClass"
              value={filters.maintClass}
              onChange={handleTextChange}
              variant="outlined"
            />
          </Paper>

          {/* WorkOrder Status Section */}
          <Paper elevation={0} sx={{ p: 2, bgcolor: "#f5f5f5" }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold" }}>
              وضعیت Work Order
            </Typography>
            <FormGroup row>
              {WORKORDER_STATUSES.map((status) => (
                <FormControlLabel
                  key={status}
                  control={
                    <Checkbox
                      checked={
                        filters.workOrderStatuses?.includes(status) ?? false
                      }
                      onChange={() =>
                        handleMultiCheckboxChange("workOrderStatuses", status)
                      }
                      size="small"
                    />
                  }
                  label={status}
                />
              ))}
            </FormGroup>
          </Paper>

          {/* Component Status Section */}
          <Paper elevation={0} sx={{ p: 2, bgcolor: "#f5f5f5" }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold" }}>
              وضعیت کامپوننت
            </Typography>
            <FormGroup row>
              {COMPONENT_STATUSES.map((status) => (
                <FormControlLabel
                  key={status}
                  control={
                    <Checkbox
                      checked={
                        filters.componentStatuses?.includes(status) ?? false
                      }
                      onChange={() =>
                        handleMultiCheckboxChange("componentStatuses", status)
                      }
                      size="small"
                    />
                  }
                  label={status}
                />
              ))}
            </FormGroup>
          </Paper>

          {/* Responsibilities Section */}
          <Paper elevation={0} sx={{ p: 2, bgcolor: "#f5f5f5" }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold" }}>
              مسئولین
            </Typography>
            <FormGroup>
              {RESPONSIBILITIES.map((resp) => (
                <FormControlLabel
                  key={resp}
                  control={
                    <Checkbox
                      checked={
                        filters.responsibilities?.includes(resp) ?? false
                      }
                      onChange={() =>
                        handleMultiCheckboxChange("responsibilities", resp)
                      }
                      size="small"
                    />
                  }
                  label={resp}
                />
              ))}
            </FormGroup>
          </Paper>

          {/* Planning Section */}
          <Paper elevation={0} sx={{ p: 2, bgcolor: "#f5f5f5" }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold" }}>
              برنامه‌ریزی
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.dueNow ?? false}
                    onChange={() => handleCheckboxChange("dueNow")}
                    size="small"
                  />
                }
                label="Due Now"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.overDue ?? false}
                    onChange={() => handleCheckboxChange("overDue")}
                    size="small"
                  />
                }
                label="Over due"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.dueThisWeek ?? false}
                    onChange={() => handleCheckboxChange("dueThisWeek")}
                    size="small"
                  />
                }
                label="Due This Week"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.dueNextWeek ?? false}
                    onChange={() => handleCheckboxChange("dueNextWeek")}
                    size="small"
                  />
                }
                label="Due next week"
              />
            </FormGroup>
            <Box sx={{ display: "flex", gap: 2, mt: 2, alignItems: "center" }}>
              <Typography variant="body2">Due between</Typography>
              <TextField
                type="date"
                size="small"
                name="dueFrom"
                value={filters.dueFrom}
                onChange={handleTextChange}
                InputLabelProps={{ shrink: true }}
                slotProps={{
                  input: { style: { width: "150px" } },
                }}
              />
              <Typography>-</Typography>
              <TextField
                type="date"
                size="small"
                name="dueTo"
                value={filters.dueTo}
                onChange={handleTextChange}
                InputLabelProps={{ shrink: true }}
                slotProps={{
                  input: { style: { width: "150px" } },
                }}
              />
            </Box>
          </Paper>

          {/* Critical Component */}
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.criticalComponent ?? false}
                onChange={() => handleCheckboxChange("criticalComponent")}
                size="small"
              />
            }
            label="Critical Component"
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          variant="outlined"
          color="error"
          startIcon={<ClearIcon />}
          onClick={handleClearFilter}
        >
          Clear Filter
        </Button>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleApply}
          variant="contained"
          color="success"
          startIcon={<CheckCircleIcon />}
        >
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}
