import { tblMaintLog, TypeTblMaintLog } from "@/core/api/generated/api";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import Splitter from "@/shared/components/Splitter";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { GridColDef } from "@mui/x-data-grid";
import { useMemo } from "react";
import TabsComponent from "./MaintLogTabs";

export default function PageMaintLog() {
  const { rows, loading, handleRefresh } = useDataGrid(
    tblMaintLog.getAll,
    tblMaintLog.getById,
    "maintLogId"
  );

  const columns = useMemo<GridColDef<TypeTblMaintLog>[]>(
    () => [
      {
        field: "component",
        headerName: "Component",
        // valueGetter: (row) => row.tblComp?.compNo ?? "",
      },
      {
        field: "jobCode",
        headerName: "JobCode",
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
        // valueGetter: (row) => row.dateDone ?? "",
      },
      {
        field: "discipline",
        headerName: "Discipline",
        // valueGetter: (row) => row.tblDiscipline?.name ?? "",
      },
      {
        field: "reportedBy",
        headerName: "Reported By",
        // valueGetter: (row) => row.tblUserReported?.fullName ?? "",
      },
      {
        field: "followStatus",
        headerName: "Follow Status",
        // valueGetter: (row) => row.tblFollowStatus?.name ?? "",
      },
      {
        field: "currentStatus",
        headerName: "Current Status",
        // valueGetter: (row) => row.tblMaintStatus?.name ?? "",
      },
      {
        field: "followCount",
        headerName: "Follow Count",
      },
      {
        field: "follower",
        headerName: "Follower",
        // valueGetter: (row) => row.tblUserFollower?.fullName ?? "",
      },
      {
        field: "statusId",
        headerName: "Status",
      },
      {
        field: "stockUsed",
        headerName: "Stock Used",
      },
      {
        field: "empHours",
        headerName: "Emp/HRS",
      },
      {
        field: "maintClass",
        headerName: "Maint Class",
        // valueGetter: (row) => row.tblMaintClass?.name ?? "",
      },
      {
        field: "totalAttachment",
        headerName: "Total Attachment",
      },
      {
        field: "downTime",
        headerName: "DownTime",
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
        // valueGetter: (row) => (row.isCritical ? "Yes" : "No"),
      },
      {
        field: "unplanned",
        headerName: "Unplanned",
        // valueGetter: (row) => (row.isUnplanned ? "Yes" : "No"),
      },
    ],
    []
  );

  return (
    <Splitter horizontal>
      <CustomizedDataGrid
        label={"Maintenance Log"}
        showToolbar
        rows={rows}
        columns={columns}
        loading={loading}
        onRefreshClick={handleRefresh}
        getRowId={(row) => row.maintLogId}
      />
      <TabsComponent />
    </Splitter>
  );
}
