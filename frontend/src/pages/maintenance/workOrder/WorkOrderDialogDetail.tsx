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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  tblWorkOrder,
  TypeTblMaintLog,
  TypeTblWorkOrder,
} from "@/core/api/generated/api";

// ─── helpers ────────────────────────────────────────────────────────────────

const fmt = (v: unknown): string => {
  if (v === null || v === undefined) return "—";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (v instanceof Date || (typeof v === "string" && v.includes("T"))) {
    const d = new Date(v as string);
    return isNaN(d.getTime()) ? String(v) : d.toLocaleDateString();
  }
  return String(v);
};

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
    <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ py: 0.5 }}>
      <Typography
        variant="caption"
        sx={{
          minWidth: 160,
          color: "text.secondary",
          fontWeight: 600,
          pt: 0.2,
        }}
      >
        {label}
      </Typography>
      <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
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
        mb: 0.5,
        display: "block",
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
  return (
    <Box>
      <SectionTitle>{title}</SectionTitle>
      <Paper variant="outlined" sx={{ borderRadius: 1 }}>
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

const maintLogColumns: GridColDef<TypeTblMaintLog>[] = [
  { field: "maintLogId", headerName: "ID", width: 70 },
  {
    field: "logDate",
    headerName: "Date",
    width: 120,
  },
  { field: "description", headerName: "Description", flex: 1, minWidth: 200 },
  { field: "jobDone", headerName: "Job Done", width: 120 },
  {
    field: "tblFollowStatus",
    headerName: "Follow Status",
    width: 130,
    valueGetter: (_, row) => row?.tblFollowStatus?.fsName ?? "—",
  },
];

const reScheduleColumns: GridColDef[] = [
  { field: "reScheduleLogId", headerName: "ID", width: 70 },
  {
    field: "reScheduleDate",
    headerName: "Reschedule Date",
    width: 150,
  },
  { field: "reason", headerName: "Reason", flex: 1, minWidth: 200 },
  {
    field: "newDueDate",
    headerName: "New Due Date",
    width: 140,
  },
];

const childWoColumns: GridColDef<TypeTblWorkOrder>[] = [
  { field: "workOrderId", headerName: "ID", width: 70 },
  { field: "woNo", headerName: "WO No", width: 120 },
  { field: "title", headerName: "Title", flex: 1, minWidth: 180 },
  {
    field: "tblWorkOrderStatus",
    headerName: "Status",
    width: 130,
    valueGetter: (_, row) => row?.tblWorkOrderStatus?.name ?? "—",
  },
  {
    field: "dueDate",
    headerName: "Due Date",
    width: 120,
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

  const fetchData = useCallback(async () => {
    if (!workOrderId) return;
    setLoading(true);
    try {
      const res = await tblWorkOrder.getById(workOrderId, {
        include: {
          tblMaintLogs: {
            include: { tblFollowStatus: true },
          },
          tblReScheduleLogs: true,
          // tblCompJob: {
          // include: {
          // tblCompJobCounters: true,
          // },
          // },
          tblComponentUnit: true,
          tblDiscipline: true,
          tblMaintCause: true,
          tblMaintClass: true,
          tblMaintType: true,
          tblWorkOrderStatus: true,
          tblRound: true,
          tblPendingType: true,
          otherTblWorkOrders: {
            include: { tblWorkOrderStatus: true },
          },
          tblUsersTblWorkOrderCreatedByTotblUsers: true,
          tblUsersTblWorkOrderIssuedByTotblUsers: true,
          tblUsersTblWorkOrderPlannedByTotblUsers: true,
        },
      });
      setData(res as any);
    } finally {
      setLoading(false);
    }
  }, [workOrderId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const wo = data as any;
  const title =
    wo?.woNo ?? (workOrderId ? `WO-${workOrderId}` : "Work Order Detail");

  const content = () => {
    if (!workOrderId) {
      return (
        <Typography variant="body2" color="text.secondary">
          No Work Order selected.
        </Typography>
      );
    }
    if (loading) {
      return (
        <Box>
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} height={32} sx={{ mb: 0.5 }} />
          ))}
        </Box>
      );
    }
    if (!data) return null;

    return (
      <Stack spacing={3}>
        {/* ── Header ── */}
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          {wo.title && (
            <Typography variant="body1" color="text.secondary">
              {wo.title}
            </Typography>
          )}
          {wo.tblWorkOrderStatus?.statusName && (
            <Chip
              label={wo.tblWorkOrderStatus.statusName}
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
        </Stack>

        <Divider />

        {/* ── General Info ── */}
        <Box>
          <SectionTitle>General</SectionTitle>
          <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 1 }}>
            <Stack spacing={0}>
              <DetailRow label="Work Order ID" value={wo.workOrderId} />
              <DetailRow label="WO No" value={wo.woNo} />
              <DetailRow label="Title" value={wo.title} />
              <DetailRow label="Status" value={wo.tblWorkOrderStatus?.name} />
              <DetailRow label="Priority" value={wo.priority} />
              <DetailRow label="Order No" value={wo.orderNo} />
              <DetailRow
                label="Unexpected"
                value={
                  wo.unexpected ? (
                    <Chip label="Yes" size="small" color="warning" />
                  ) : (
                    "No"
                  )
                }
              />
              <DetailRow
                label="Filed"
                value={
                  wo.filed ? (
                    <Chip label="Yes" size="small" color="success" />
                  ) : (
                    "No"
                  )
                }
              />
            </Stack>
          </Paper>
        </Box>

        {/* ── Dates ── */}
        <Box>
          <SectionTitle>Dates & Timing</SectionTitle>
          <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 1 }}>
            <Stack spacing={0}>
              <DetailRow label="Issued Date" value={fmt(wo.issuedDate)} />
              <DetailRow label="Due Date" value={fmt(wo.dueDate)} />
              <DetailRow
                label="Due Count"
                value={wo?.tblCompJob?.tblCompJobCounter?.nextDueCount}
              />
              <DetailRow label="Created" value={fmt(wo.created)} />
              <DetailRow label="Started" value={fmt(wo.started)} />
              <DetailRow label="Completed" value={fmt(wo.completed)} />
              <DetailRow label="Last Update" value={fmt(wo.lastupdate)} />
              <DetailRow
                label="Est. Total Duration"
                value={wo.estTotalDuration ? `${wo.estTotalDuration} min` : "—"}
              />
              <DetailRow label="Window" value={wo.window} />
            </Stack>
          </Paper>
        </Box>

        {/* ── Classification ── */}
        <Box>
          <SectionTitle>Classification</SectionTitle>
          <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 1 }}>
            <Stack spacing={0}>
              <DetailRow
                label="Maint. Class"
                value={wo.tblMaintClass?.maintClassName}
              />
              <DetailRow
                label="Maint. Type"
                value={wo.tblMaintType?.maintTypeName}
              />
              <DetailRow
                label="Maint. Cause"
                value={wo.tblMaintCause?.maintCauseName}
              />
              <DetailRow
                label="Discipline"
                value={wo.tblDiscipline?.discName}
              />
              <DetailRow label="Round" value={wo.tblRound?.roundName} />
              <DetailRow label="Reporting Method" value={wo.reportingMethod} />
            </Stack>
          </Paper>
        </Box>

        {/* ── Component ── */}
        <Box>
          <SectionTitle>Component</SectionTitle>
          <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 1 }}>
            <Stack spacing={0}>
              <DetailRow
                label="Component No"
                value={wo.tblComponentUnit?.compNo}
              />
              <DetailRow
                label="Component Name"
                value={wo.tblComponentUnit?.compName}
              />
              <DetailRow label="Frequency" value={wo.tblCompJob?.frequency} />
            </Stack>
          </Paper>
        </Box>

        {/* ── Pending ── */}
        {(wo.pendTypeId || wo.pendingBy || wo.pendingdate) && (
          <Box>
            <SectionTitle>Pending Info</SectionTitle>
            <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 1 }}>
              <Stack spacing={0}>
                <DetailRow
                  label="Pending Type"
                  value={wo.tblPendingType?.pendTypeName}
                />
                <DetailRow label="Pending Date" value={fmt(wo.pendingdate)} />
                <DetailRow label="User Comment" value={wo.userComment} />
              </Stack>
            </Paper>
          </Box>
        )}

        <Divider />

        {/* ── Nested: Maintenance Logs ── */}
        {wo.tblMaintLogs?.length > 0 && (
          <NestedGrid
            title="Maintenance Logs"
            rows={wo.tblMaintLogs}
            columns={maintLogColumns}
            getRowId={(r: any) => r.maintLogId}
          />
        )}

        {/* ── Nested: Child Work Orders ── */}
        {wo.otherTblWorkOrders?.length > 0 && (
          <NestedGrid
            title="Child Work Orders"
            rows={wo.otherTblWorkOrders}
            columns={childWoColumns}
            getRowId={(r: any) => r.workOrderId}
          />
        )}
      </Stack>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {title}
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>{content()}</DialogContent>
    </Dialog>
  );
}
