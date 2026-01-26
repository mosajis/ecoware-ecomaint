import {
  tblLogCounter,
  TypeTblLogCounter,
  TypeTblMaintLog,
} from "@/core/api/generated/api";
import { formatDateTime } from "@/core/helper";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { GridColDef } from "@mui/x-data-grid";
import { useCallback } from "react";

interface Props {
  selected: TypeTblMaintLog;
  label?: string | null;
}

const TabLogCounter = (props: Props) => {
  const { selected, label } = props;

  const getAll = useCallback(() => {
    return tblLogCounter.getAll({
      filter: {
        maintLogId: selected.maintLogId,
      },
      include: { tblCounterType: true },
    });
  }, [selected?.maintLogId]);

  const { rows, loading, handleRefresh } = useDataGrid(
    getAll,
    tblLogCounter.getById,
    "logCounterId",
    !!selected?.maintLogId,
  );

  const columns: GridColDef<TypeTblLogCounter>[] = [
    { field: "frequency", headerName: "Frequency", flex: 1 },
    { field: "reportedCount", headerName: "ReportedCount", flex: 1 },
    { field: "overdueCount", headerName: "OverDueCounter", flex: 1 },
    {
      field: "CounterTypeName",
      headerName: "CounterTypeName",
      flex: 1,
      valueGetter: (_, row) => row?.tblCounterType?.name,
    },
    {
      field: "lastupdate",
      headerName: "lastUpdated",
      flex: 1,
      valueFormatter: (value) => (value ? formatDateTime(value) : ""),
    },
  ];

  return (
    <CustomizedDataGrid
      label={label || "Resource Used"}
      rows={rows}
      loading={loading}
      showToolbar
      getRowId={(row) => row.logCounterId}
      onRefreshClick={handleRefresh}
      columns={columns}
    />
  );
};

export default TabLogCounter;
