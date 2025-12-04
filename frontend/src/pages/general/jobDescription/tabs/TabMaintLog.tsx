import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useCallback } from "react";
import { tblMaintLog, TypeTblMaintLog } from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";
import { useDataGrid } from "../../_hooks/useDataGrid";

interface TabMaintLogProps {
  label?: string | null;
}

const columns: GridColDef<TypeTblMaintLog>[] = [
  {
    field: "component",
    headerName: "Component",
    flex: 1,
    valueGetter: (_, r) => r.tblComponentUnit?.compNo,
  },
  {
    field: "jobCode",
    headerName: "JobCode",
    flex: 1,
    valueGetter: (_, r) => r.tblJob?.jobCode,
  },
  {
    field: "jobName",
    headerName: "JobName",
    flex: 1,
    valueGetter: (_, r) => r.tblJob?.jobName,
  },
  {
    field: "dateDone",
    headerName: "DateDone",
    flex: 1,
    valueGetter: (_, r) => r.dateDone,
  },
  {
    field: "discipline",
    headerName: "Discipline",
    flex: 1,
    valueGetter: (_, r) => r.tblDiscipline?.discName,
  },
  {
    field: "reportedBy",
    headerName: "Reported By",
    flex: 1,
    valueGetter: (_, r) => r.reportedBy,
  },
  {
    field: "followStatus",
    headerName: "Follow Status",
    flex: 1,
    valueGetter: (_, r) => r.tblFollowStatus?.statusName,
  },
  {
    field: "currentFollow",
    headerName: "Current User Follow Status",
    flex: 1,
    valueGetter: (_, r) => r.currentUserFollowStatus,
  },
  {
    field: "followCount",
    headerName: "Follow Count",
    flex: 1,
    valueGetter: (_, r) => r.followCount,
  },
  {
    field: "follower",
    headerName: "Follower",
    flex: 1,
    valueGetter: (_, r) => r.follower,
  },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    valueGetter: (_, r) => r.tblMaintStatus?.statusName,
  },
  {
    field: "stockUsed",
    headerName: "Stock Used",
    flex: 1,
    valueGetter: (_, r) => r.stockUsed,
  },
  {
    field: "empHrs",
    headerName: "Emp/hrs",
    flex: 1,
    valueGetter: (_, r) => r.empHours,
  },
  {
    field: "maintClass",
    headerName: "Maint Class",
    flex: 1,
    valueGetter: (_, r) => r.tblMaintClass?.className,
  },
  {
    field: "totalAttach",
    headerName: "Total Attach",
    flex: 1,
    valueGetter: (_, r) => r.totalAttach,
  },
  {
    field: "totalMessage",
    headerName: "Total Message",
    flex: 1,
    valueGetter: (_, r) => r.totalMessage,
  },
  {
    field: "downTime",
    headerName: "DownTime (Min)",
    flex: 1,
    valueGetter: (_, r) => r.downTime,
  },
  {
    field: "compStatus",
    headerName: "Comp Status Name",
    flex: 1,
    valueGetter: (_, r) => r.tblComponentUnit?.tblCompStatus?.compStatusName,
  },
  {
    field: "isCritical",
    headerName: "IsCritical",
    flex: 1,
    valueGetter: (_, r) => (r.isCritical ? "Yes" : "No"),
  },
  {
    field: "unplanned",
    headerName: "Unplanned",
    flex: 1,
    valueGetter: (_, r) => (r.unplanned ? "Yes" : "No"),
  },
];

export default function TabMaintLog(props: TabMaintLogProps) {
  const { label } = props;

  const getAll = useCallback(() => {
    return tblMaintLog.getAll({
      include: {
        tblComponentUnit: { include: { tblCompStatus: true } },
        tblJob: true,
        tblDiscipline: true,
        tblFollowStatus: true,
        tblMaintStatus: true,
        tblMaintClass: true,
      },
    });
  }, []);

  const { rows, loading, fetchData } = useDataGrid(
    getAll,
    tblMaintLog.deleteById,
    "maintLogId"
  );

  return (
    <CustomizedDataGrid
      rows={rows}
      columns={columns}
      loading={loading}
      label={label || "Maintenance Log"}
      showToolbar
      onRefreshClick={fetchData}
      getRowId={(row) => row.maintLogId}
    />
  );
}
