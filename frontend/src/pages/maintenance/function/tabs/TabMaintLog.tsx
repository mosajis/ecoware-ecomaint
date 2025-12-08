import { useMemo } from "react";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { GridColDef } from "@mui/x-data-grid";
import { tblMaintLog, TypeTblMaintLog } from "@/core/api/generated/api";

interface TabMaintLogProps {
  functionId?: number | null;
  label?: string | null;
}

const TabMaintLog = ({ functionId, label }: TabMaintLogProps) => {
  const { rows, loading, handleRefresh } = useDataGrid(
    tblMaintLog.getAll,
    tblMaintLog.getById,
    "maintLogId",
    !!functionId
  );

  const columns = useMemo<GridColDef<TypeTblMaintLog>[]>(
    () => [
      {
        field: "component",
        headerName: "Component",
        width: 130,
        // valueGetter: (row) => row.tblComp?.compNo ?? "",
      },
      {
        field: "jobCode",
        headerName: "JobCode",
        width: 120,
        // valueGetter: (row) => row.tblJobDescription?.code ?? "",
      },
      {
        field: "jobName",
        headerName: "JobName",
        flex: 1,
        // valueGetter: (row) => row.tblJobDescription?.title ?? "",
      },
      {
        field: "dateDone",
        headerName: "DateDone",
        width: 150,
        // valueGetter: (row) => row.dateDone ?? "",
      },
      {
        field: "discipline",
        headerName: "Discipline",
        width: 150,
        // valueGetter: (row) => row.tblDiscipline?.name ?? "",
      },
      {
        field: "reportedBy",
        headerName: "Reported By",
        width: 170,
        // valueGetter: (row) => row.tblUserReported?.fullName ?? "",
      },
      {
        field: "followStatus",
        headerName: "Follow Status",
        width: 150,
        // valueGetter: (row) => row.tblFollowStatus?.name ?? "",
      },
      {
        field: "currentStatus",
        headerName: "Current Status",
        width: 150,
        // valueGetter: (row) => row.tblMaintStatus?.name ?? "",
      },
      {
        field: "followCount",
        headerName: "Follow Count",
        width: 140,
      },
      {
        field: "follower",
        headerName: "Follower",
        width: 150,
        // valueGetter: (row) => row.tblUserFollower?.fullName ?? "",
      },
      {
        field: "statusId",
        headerName: "Status",
        width: 120,
      },
      {
        field: "stockUsed",
        headerName: "Stock Used",
        width: 140,
      },
      {
        field: "empHours",
        headerName: "Emp/HRS",
        width: 120,
      },
      {
        field: "maintClass",
        headerName: "Maint Class",
        width: 150,
        // valueGetter: (row) => row.tblMaintClass?.name ?? "",
      },
      {
        field: "totalAttachment",
        headerName: "Total Attachment",
        width: 160,
      },
      {
        field: "downTime",
        headerName: "DownTime",
        width: 130,
      },
      {
        field: "componentStatusName",
        headerName: "Component Status Name",
        width: 180,
        // valueGetter: (row) => row.tblCompStatus?.name ?? "",
      },
      {
        field: "isCritical",
        headerName: "IsCritical",
        width: 120,
        // valueGetter: (row) => (row.isCritical ? "Yes" : "No"),
      },
      {
        field: "unplanned",
        headerName: "Unplanned",
        width: 120,
        // valueGetter: (row) => (row.isUnplanned ? "Yes" : "No"),
      },
    ],
    []
  );

  return (
    <CustomizedDataGrid
      label={label ?? "Maintenance Log"}
      showToolbar
      rows={rows}
      columns={columns}
      loading={loading}
      onRefreshClick={handleRefresh}
      getRowId={(row) => row.maintLogId}
    />
  );
};

export default TabMaintLog;
