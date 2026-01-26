import { useCallback, useMemo } from "react";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { GridColDef } from "@mui/x-data-grid";
import {
  tblFailureReports,
  TypeTblFailureReports,
  TypeTblMaintLog,
} from "@/core/api/generated/api";
import { formatDateTime } from "@/core/helper";

interface Props {
  selected: TypeTblMaintLog;
  label?: string | null;
}

const TabFailureReport = ({ selected, label }: Props) => {
  const getAll = useCallback(() => {
    return tblFailureReports.getAll({
      // include: { tblJobClass: true },
    });
  }, [selected?.maintLogId]);

  const { rows, loading, handleRefresh } = useDataGrid(
    getAll,
    tblFailureReports.getById,
    "failureReportId",
    !!selected?.maintLogId,
  );

  const columns = useMemo<GridColDef<TypeTblFailureReports>[]>(
    () => [
      {
        field: "compNo",
        headerName: "Comp No (not set)",
        width: 130,
        // valueGetter: (_, row) => row.tblComponentUnit?.compNo ?? '',
      },
      {
        field: "failureDateTime",
        headerName: "Failure Date",
        width: 150,
        valueFormatter: (value) => (value ? formatDateTime(value) : ""),
      },
      {
        field: "title",
        headerName: "Title",
        flex: 1,
      },
      {
        field: "totalWait",
        headerName: "Total Wait",
        width: 140,
      },
      {
        field: "discName (not set)",
        headerName: "Disc Name",
        width: 150,
      },
      {
        field: "loggedBy  (not set)",
        headerName: "Logged By",
        width: 150,
        // valueGetter: (row) => row.tblUserLogged?.fullName ?? "",
      },
      {
        field: "approvedby  (not set)",
        headerName: "Approved By",
        width: 150,
      },
      {
        field: "closedBy  (not set)",
        headerName: "Closed By",
        width: 150,
      },
      {
        field: "closedDateTime  (not set)",
        headerName: "Closed Date",
        width: 150,
        valueFormatter: (value) => (value ? formatDateTime(value) : ""),
      },
    ],
    [],
  );

  return (
    <CustomizedDataGrid
      label={label ?? "Failure Report"}
      showToolbar
      rows={rows}
      columns={columns}
      loading={loading}
      onRefreshClick={handleRefresh}
      getRowId={(row) => row.failureReportId}
    />
  );
};

export default TabFailureReport;
