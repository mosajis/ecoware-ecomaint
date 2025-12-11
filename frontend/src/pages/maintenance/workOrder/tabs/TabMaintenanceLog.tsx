import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import {
  tblMaintLog,
  TypeTblMaintLog,
  TypeTblWorkOrder,
} from "@/core/api/generated/api";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { GridColDef } from "@mui/x-data-grid";
import { useCallback } from "react";

interface Props {
  workOrder?: TypeTblWorkOrder | null;
  label?: string | null;
}

const TabMaintenanceLog = (props: Props) => {
  const { workOrder } = props;

  const columns: GridColDef<TypeTblMaintLog>[] = [
    {
      field: "component",
      headerName: "Component",
      flex: 1,
      valueGetter: (_, row) => row?.tblComponentUnit?.compNo,
    },
    {
      field: "jobCode",
      headerName: "Job Code",
      flex: 1,
      valueGetter: (_, row) => row?.tblJobDescription?.jobDescCode,
    },
    {
      field: "jobName",
      headerName: "Job Name",
      flex: 1,
      valueGetter: (_, row) => row?.tblJobDescription?.jobDescTitle,
    },
    {
      field: "dateDone",
      headerName: "Date Done",
      flex: 1,
      valueGetter: (_, row) => row?.dateDone,
    },
    {
      field: "reportedBy",
      headerName: "Reported By",
      flex: 1,
      valueGetter: (_, row) => row?.usersTblMaintLogLoggedByToUsers?.uName,
    },
    {
      field: "followStatus",
      headerName: "Follow Status",
      flex: 1,
      valueGetter: (_, row) => row?.tblFollowStatus?.fsName,
    },
    {
      field: "currentUserFollowStatus",
      headerName: "Current User Follow Status",
      flex: 1,
      valueGetter: () => null, // ❗ نیاز به دیتای بیشتر دارد
    },
    {
      field: "followCount",
      headerName: "Follow Count",
      flex: 1,
      valueGetter: (_, row) => row?.overdueCount,
    },
    {
      field: "follower",
      headerName: "Follower",
      flex: 1,
      valueGetter: (_, row) => row?.usersTblMaintLogUserIdToUsers?.uName,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      valueGetter: (_, row) => row?.mlStatus,
    },
    {
      field: "empHrs",
      headerName: "Emp / Hrs",
      flex: 1,
      valueGetter: (_, row) => row?.totalDuration,
    },
    {
      field: "maintClass",
      headerName: "Maint Class",
      flex: 1,
      valueGetter: (_, row) => row?.tblMaintClass?.descr,
    },
    {
      field: "downTime",
      headerName: "DownTime (min)",
      flex: 1,
      valueGetter: (_, row) => row?.downTime,
    },
    {
      field: "compStatus",
      headerName: "Comp Status",
      flex: 1,
      valueGetter: (_, row) =>
        // @ts-ignore
        row?.tblComponentUnit?.tblCompStatus?.compStatusName,
    },
    {
      field: "isCritical",
      headerName: "Is Critical",
      flex: 1,
      valueGetter: (_, row) => (row?.unexpected === 1 ? "Yes" : "No"),
    },
    {
      field: "unPlanned",
      headerName: "UnPlanned",
      flex: 1,
      valueGetter: (_, row) => (row?.unexpected === 1 ? "Yes" : "No"),
    },
  ];

  const getAll = useCallback(
    () =>
      tblMaintLog.getAll({
        filter: {
          compId: workOrder?.compId,
          jobDescId: workOrder?.tblCompJob?.jobDescId,
        },
        include: {
          tblComponentUnit: {
            include: {
              tblCompStatus: true,
            },
          },
          tblJobDescription: true,
          tblMaintClass: true,
        },
      }),
    [workOrder]
  );
  // === useDataGrid ===
  const { rows, loading, handleRefresh } = useDataGrid(
    getAll,
    tblMaintLog.deleteById,
    "maintLogId",
    !!workOrder?.workOrderId
  );

  return (
    <CustomizedDataGrid
      showToolbar
      label="MaintLog"
      loading={loading}
      onRefreshClick={handleRefresh}
      getRowId={(row) => row.maintLogId}
      rows={rows}
      columns={columns}
    />
  );
};

export default TabMaintenanceLog;
