import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Typography,
  Tab,
  Tabs,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  tblWorkOrder,
  TypeTblMaintLog,
  TypeTblWorkOrder,
} from "@/core/api/generated/api";
import { formatDateTime } from "@/core/helper";
import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";

// ─── helpers ────────────────────────────────────────────────────────────────

const fmt = (v: unknown): any => {
  if (v === null || v === undefined) return "—";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (v instanceof Date || (typeof v === "string" && v.includes("T"))) {
    const d = new Date(v as string);
    return <CellDateTime value={d} />;
  }
  return String(v);
};

// ─── tab panel ───────────────────────────────────────────────────────────────

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

// ─── sub-components ─────────────────────────────────────────────────────────

/** One row in the key-value detail section */
function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <Stack
      direction="row"
      spacing={0.5}
      alignItems="flex-start"
      sx={{ py: 0.5 }}
    >
      <Typography
        variant="caption"
        sx={{
          minWidth: 180,
          color: "text.secondary",
          fontWeight: 600,
          pt: 0.2,
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{ wordBreak: "break-word", flex: 1 }}
        color="textPrimary"
      >
        {value ?? "—"}
      </Typography>
    </Stack>
  );
}

/** Section header */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      variant="overline"
      sx={{
        color: "primary.main",
        fontWeight: 700,
        letterSpacing: 1.5,
        mb: 1,
        display: "block",
        borderBottom: "2px solid",
        borderColor: "primary.light",
        paddingBottom: 0.5,
      }}
    >
      {children}
    </Typography>
  );
}

/** Small embedded DataGrid */
function NestedGrid<T extends object>({
  title,
  rows,
  columns,
  getRowId,
}: {
  title: string;
  rows: T[];
  columns: GridColDef[];
  getRowId: (r: T) => number | string;
}) {
  if (!rows || rows.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mb: 3 }}>
      <SectionTitle>{title}</SectionTitle>
      <Paper variant="outlined" sx={{ borderRadius: 1, overflow: "hidden" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={getRowId}
          density="compact"
          autoHeight
          disableRowSelectionOnClick
          hideFooterPagination={rows.length <= 10}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          pageSizeOptions={[10, 25]}
          sx={{
            border: 0,
            "& .MuiDataGrid-columnHeaders": { bgcolor: "action.hover" },
          }}
        />
      </Paper>
    </Box>
  );
}

// ─── columns for nested grids ────────────────────────────────────────────────

const maintLogColumns: GridColDef[] = [
  { field: "maintLogId", headerName: "ID", width: 80 },
  {
    field: "dateDone",
    headerName: "Date Completed",
    width: 130,
    valueGetter: (_, row: any) => fmt(row?.dateDone),
  },
  {
    field: "totalDuration",
    headerName: "Duration (min)",
    width: 120,
    type: "number",
  },
  {
    field: "downTime",
    headerName: "Down Time (min)",
    width: 120,
    type: "number",
  },
  {
    field: "history",
    headerName: "Description",
    flex: 1,
    minWidth: 200,
  },
  {
    field: "tblFollowStatus",
    headerName: "Follow Status",
    width: 130,
    valueGetter: (_, row: any) => row?.tblFollowStatus?.fsName ?? "—",
  },
];

const reScheduleColumns: GridColDef[] = [
  { field: "rescheduleLogId", headerName: "ID", width: 80 },
  {
    field: "rescheduledDate",
    headerName: "Reschedule Date",
    width: 130,
    valueGetter: (_, row: any) => fmt(row?.rescheduledDate),
  },
  {
    field: "fromDueDate",
    headerName: "From Date",
    width: 130,
    valueGetter: (_, row: any) => fmt(row?.fromDueDate),
  },
  {
    field: "toDueDate",
    headerName: "To Date",
    width: 130,
    valueGetter: (_, row: any) => fmt(row?.toDueDate),
  },
  {
    field: "reason",
    headerName: "Reason",
    flex: 1,
    minWidth: 200,
  },
];

const childWoColumns: GridColDef[] = [
  { field: "workOrderId", headerName: "ID", width: 80 },
  { field: "woNo", headerName: "WO No", width: 120 },
  { field: "title", headerName: "Title", flex: 1, minWidth: 180 },
  {
    field: "tblWorkOrderStatus",
    headerName: "Status",
    width: 130,
    valueGetter: (_, row: any) => row?.tblWorkOrderStatus?.name ?? "—",
  },
  {
    field: "dueDate",
    headerName: "Due Date",
    width: 130,
    valueGetter: (_, row: any) => fmt(row?.dueDate),
  },
  {
    field: "priority",
    headerName: "Priority",
    width: 100,
    type: "number",
  },
];

// ─── main component ──────────────────────────────────────────────────────────

type Props = {
  workOrderId: number | null | undefined;
  open: boolean;
  onClose: () => void;
};

export default function WorkOrderDetailDialog({
  workOrderId,
  open,
  onClose,
}: Props) {
  const [data, setData] = useState<TypeTblWorkOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const fetchData = useCallback(async () => {
    if (!workOrderId) return;
    setLoading(true);
    try {
      const res = await tblWorkOrder.getById(workOrderId, {
        include: {
          // وضعیت
          tblWorkOrderStatus: true,

          // کلاسیفیکیشن
          tblMaintClass: true,
          tblMaintType: true,
          tblMaintCause: true,
          tblDiscipline: true,
          tblRound: true,
          tblPendingType: true,

          // اجزا
          tblComponentUnit: {
            include: {
              tblCompJobs: true,
            },
          },

          // شغل
          tblCompJob: {
            include: {
              tblCompJobCounters: true,
              tblPeriod: true,
            },
          },

          // سابقه
          tblMaintLogs: {
            include: {
              tblFollowStatus: true,
            },
          },

          // تعویق
          tblReScheduleLogs: true,

          // کارمندان
          tblEmployeeTblWorkOrderCreatedByTotblEmployee: true,
          tblEmployeeTblWorkOrderIssuedByTotblEmployee: true,
          tblEmployeeTblWorkOrderPlannedByTotblEmployee: true,
          tblEmployeeTblWorkOrderPendingByTotblEmployee: true,

          // نصب
          tblInstallation: true,

          // فرزندان
          otherTblWorkOrders: {
            include: {
              tblWorkOrderStatus: true,
            },
          },
        },
      });
      setData(res as any);
    } catch (error) {
      console.error("Error fetching work order:", error);
    } finally {
      setLoading(false);
    }
  }, [workOrderId]);

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open, fetchData]);

  const wo = data as any;
  const title = wo?.title ?? (workOrderId ? `WO-${workOrderId}` : "جزئیات کار");

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const content = () => {
    if (!workOrderId) {
      return (
        <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
          Please Select a WorkOrder
        </Typography>
      );
    }

    if (loading) {
      return (
        <Box sx={{ p: 2 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} height={32} sx={{ mb: 1 }} />
          ))}
        </Box>
      );
    }

    if (!data) return null;

    // Get first counter for Due Count
    const firstCounter = wo?.tblCompJob?.tblCompJobCounters?.[0];
    const nextDueCount = firstCounter?.nextDueCount;

    return (
      <Box gap={1.5} gridTemplateColumns={"1fr 1fr"} display={"grid"}>
        {/* Basic Information */}
        <Box>
          <SectionTitle>Basic Information</SectionTitle>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
            <Stack spacing={0.5}>
              <DetailRow label="Work Order ID" value={wo.workOrderId} />
              <DetailRow label="WO Number" value={wo.woNo} />
              <DetailRow label="Title" value={wo.title} />
              <DetailRow label="Description" value={wo.description} />
              <DetailRow label="Status" value={wo.tblWorkOrderStatus?.name} />
              <DetailRow label="Priority" value={wo.priority} />
              <DetailRow label="Order Number" value={wo.orderNo} />
              <DetailRow label="Reporting Method" value={wo.reportingMethod} />
              <DetailRow
                label="Installation"
                value={wo.tblInstallation?.name}
              />
            </Stack>
          </Paper>
        </Box>

        {/* Dates and Timing */}
        <Box>
          <SectionTitle>Dates & Timing</SectionTitle>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
            <Stack spacing={0.5}>
              <DetailRow label="Issued Date" value={fmt(wo.issuedDate)} />
              <DetailRow label="Due Date" value={fmt(wo.dueDate)} />
              <DetailRow label="Due Count" value={nextDueCount} />
              <DetailRow label="Created Date" value={fmt(wo.created)} />
              <DetailRow label="Started Date" value={fmt(wo.started)} />
              <DetailRow label="Completed Date" value={fmt(wo.completed)} />
              <DetailRow label="Last Update" value={fmt(wo.lastUpdate)} />
              <DetailRow
                label="Est. Total Duration"
                value={
                  wo.estTotalDuration ? `${wo.estTotalDuration} minutes` : "—"
                }
              />
              <DetailRow label="Time Window" value={wo.window} />
            </Stack>
          </Paper>
        </Box>

        {/* Classification */}
        <Box>
          <SectionTitle>Classification & Categories</SectionTitle>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
            <Stack spacing={0.5}>
              <DetailRow
                label="Maintenance Class"
                value={wo.tblMaintClass?.descr}
              />
              <DetailRow
                label="Maintenance Type"
                value={wo.tblMaintType?.descr}
              />
              <DetailRow
                label="Maintenance Cause"
                value={wo.tblMaintCause?.descr}
              />
              <DetailRow label="Discipline" value={wo.tblDiscipline?.name} />
              <DetailRow label="Round" value={wo.tblRound?.roundTitle} />
            </Stack>
          </Paper>
        </Box>

        {/* Components & Equipment */}
        <Box>
          <SectionTitle>Components & Equipment</SectionTitle>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
            <Stack spacing={0.5}>
              <DetailRow
                label="Component Number"
                value={wo.tblComponentUnit?.compNo}
              />
              <DetailRow
                label="Component Name"
                value={wo.tblComponentUnit?.compName}
              />
              <DetailRow
                label="Serial Number"
                value={wo.tblComponentUnit?.serialNo}
              />
              <DetailRow label="Model" value={wo.tblComponentUnit?.model} />
              <DetailRow
                label="Asset Number"
                value={wo.tblComponentUnit?.assetNo}
              />
              <DetailRow
                label="Total Component Jobs"
                value={wo.tblComponentUnit?.tblCompJobs?.length ?? 0}
              />
            </Stack>
          </Paper>
        </Box>

        {/* Component Job */}
        {wo.tblCompJob && (
          <Box>
            <SectionTitle>Component Job & Counter</SectionTitle>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
              <Stack spacing={0.5}>
                <DetailRow label="Frequency" value={wo.tblCompJob.frequency} />
                <DetailRow
                  label="Frequency Period"
                  value={wo.tblCompJob.tblPeriod?.name}
                />
                <DetailRow
                  label="Last Done"
                  value={fmt(wo.tblCompJob.lastDone)}
                />
                <DetailRow
                  label="Next Due Date"
                  value={fmt(wo.tblCompJob.nextDueDate)}
                />
                <DetailRow
                  label="Total Counters"
                  value={wo.tblCompJob.tblCompJobCounters?.length ?? 0}
                />
              </Stack>
            </Paper>
          </Box>
        )}

        {/* Pending Information */}
        {(wo.pendTypeId || wo.pendingBy || wo.pendingdate) && (
          <Box>
            <SectionTitle>Pending Information</SectionTitle>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
              <Stack spacing={0.5}>
                <DetailRow
                  label="Pending Type"
                  value={wo.tblPendingType?.pendTypeName}
                />
                <DetailRow label="Pending Date" value={fmt(wo.pendingdate)} />
                <DetailRow
                  label="Pending By"
                  value={`${wo.tblEmployeeTblWorkOrderPendingByTotblEmployee?.firstName} ${wo.tblEmployeeTblWorkOrderPendingByTotblEmployee?.lastName}`}
                />
                <DetailRow label="User Comment" value={wo.userComment} />
              </Stack>
            </Paper>
          </Box>
        )}

        {/* Related Employees */}
        <Box>
          <SectionTitle>Related Employees</SectionTitle>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
            <Stack spacing={0.5}>
              <DetailRow
                label="Created By"
                value={`${wo.tblEmployeeTblWorkOrderCreatedByTotblEmployee?.firstName} ${wo.tblEmployeeTblWorkOrderCreatedByTotblEmployee?.lastName}`}
              />
              <DetailRow
                label="Issued By"
                value={`${wo.tblEmployeeTblWorkOrderIssuedByTotblEmployee?.firstName} ${wo.tblEmployeeTblWorkOrderIssuedByTotblEmployee?.lastName}`}
              />
              <DetailRow
                label="Planned By"
                value={`${wo.tblEmployeeTblWorkOrderPlannedByTotblEmployee?.firstName} ${wo.tblEmployeeTblWorkOrderPlannedByTotblEmployee?.lastName}`}
              />
            </Stack>
          </Paper>
        </Box>
      </Box>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle
        sx={{
          padding: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {wo && (
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            flexWrap="wrap"
          >
            {wo.title && (
              <Typography variant="h6" color="textSecondary">
                {wo.title}
              </Typography>
            )}
            {wo.tblWorkOrderStatus?.name && (
              <Chip
                label={wo.tblWorkOrderStatus.name}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {wo.priority !== null && wo.priority !== undefined && (
              <Chip
                label={`Priority ${wo.priority}`}
                size="small"
                variant="outlined"
              />
            )}
            {wo.unexpected && (
              <Chip
                label="Unexpected"
                size="small"
                color="warning"
                variant="filled"
              />
            )}
            {wo.filed && (
              <Chip
                label="Filed"
                size="small"
                color="success"
                variant="filled"
              />
            )}
          </Stack>
        )}
        <IconButton size="small" onClick={onClose} sx={{ color: "inherit" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ backgroundColor: "background.default" }}>
        {content()}
      </DialogContent>
    </Dialog>
  );
}
