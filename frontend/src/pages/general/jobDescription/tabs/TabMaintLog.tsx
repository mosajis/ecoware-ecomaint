import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useCallback } from "react";
import { tblMaintLog, TypeTblMaintLog } from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";

interface TabMaintLogProps {
  label?: string | null;
  jobDescriptionId: number;
}

const columns: GridColDef<TypeTblMaintLog>[] = [
  {
    field: "jobCode",
    headerName: "JobCode",
    width: 120,
    valueGetter: (_, r) => r.tblJobDescription?.jobDescCode,
  },
  {
    field: "component",
    headerName: "Component",
    width: 200,
    valueGetter: (_, r) => r.tblComponentUnit?.compNo,
  },

  {
    field: "job Title",
    headerName: "JobTitle",
    flex: 1,
    valueGetter: (_, r) => r.tblJobDescription?.jobDescTitle,
  },
  {
    field: "dateDone",
    headerName: "DateDone",
    width: 200,
    valueGetter: (_, r) => r.dateDone,
  },
  {
    field: "maintClass",
    headerName: "Maint Class",
    width: 150,
    valueGetter: (_, r) => r.tblMaintClass?.descr,
  },
  {
    field: "totalDuration",
    headerName: "Total Duration",
    width: 120,
    valueGetter: (_, r) => r.totalDuration,
  },

  {
    field: "downTime",
    headerName: "DownTime (Min)",
    width: 120,
    valueGetter: (_, r) => r.downTime,
  },
];

export default function TabMaintLog(props: TabMaintLogProps) {
  const { label, jobDescriptionId } = props;

  const getAll = useCallback(() => {
    return tblMaintLog.getAll({
      filter: {
        jobDescId: jobDescriptionId,
      },
      include: {
        tblComponentUnit: true,
        tblJobDescription: true,
        tblMaintClass: true,
      },
    });
  }, [jobDescriptionId]);

  const { rows, loading, fetchData } = useDataGrid(
    getAll,
    tblMaintLog.deleteById,
    "maintLogId",
    !!jobDescriptionId
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
