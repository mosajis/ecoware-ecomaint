import { useMemo } from "react";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { GridColDef } from "@mui/x-data-grid";
import {
  tblFailureReports,
  TypeTblFailureReports,
} from "@/core/api/generated/api";

interface TabFailureReportProps {
  functionId?: number | null;
  label?: string | null;
}

const TabFailureReport = ({ functionId, label }: TabFailureReportProps) => {
  const { rows, loading, handleRefresh } = useDataGrid(
    tblFailureReports.getAll,
    tblFailureReports.getById,
    "failureReportId",
    !!functionId
  );

  const columns = useMemo<GridColDef<TypeTblFailureReports>[]>(
    () => [
      {
        field: "number",
        headerName: "Number",
        width: 120,
      },
      {
        field: "compNo",
        headerName: "Comp No",
        width: 130,
        // valueGetter: (row) => row.tblComp?.compNo ?? "",
      },
      {
        field: "failureDate",
        headerName: "Failure Date",
        width: 150,
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
        field: "discName",
        headerName: "Disc Name",
        width: 150,
      },
      {
        field: "lastUpdated",
        headerName: "Last Updated",
        width: 160,
      },
      {
        field: "loggedBy",
        headerName: "Logged By",
        width: 150,
        // valueGetter: (row) => row.tblUserLogged?.fullName ?? "",
      },
      {
        field: "approvedBy",
        headerName: "Approved By",
        width: 150,
      },
      {
        field: "closedBy",
        headerName: "Closed By",
        width: 150,
      },
      {
        field: "closedDate",
        headerName: "Closed Date",
        width: 150,
      },
    ],
    []
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
