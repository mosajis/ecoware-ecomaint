import { useMemo } from "react";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { GridColDef } from "@mui/x-data-grid";
import { tblWorkOrder, TypeTblWorkOrder } from "@/core/api/generated/api";

interface TabWorkOrderProps {
  functionId?: number | null;
  label?: string | null;
}

const TabWorkOrder = ({ functionId, label }: TabWorkOrderProps) => {
  const { rows, loading, handleRefresh } = useDataGrid(
    tblWorkOrder.getAll,
    tblWorkOrder.deleteAll,
    "workOrderId",
    !!functionId
  );

  const columns = useMemo<GridColDef<TypeTblWorkOrder>[]>(
    () => [
      { field: "workOrderNo", headerName: "Number", width: 120 },

      {
        field: "jobCode",
        headerName: "JobCode",
        width: 140,
        // valueGetter: (row) => row.tblJobDescription?.code ?? "",
      },

      {
        field: "component",
        headerName: "Component",
        width: 140,
        // valueGetter: (row) => row.tblComp?.compNo ?? "",
      },

      {
        field: "location",
        headerName: "Location",
        width: 140,
        // valueGetter: (row) => row.tblLocation?.name ?? "",
      },

      {
        field: "jobDescTitle",
        headerName: "JobDescTitle",
        flex: 1,
        // valueGetter: (row) => row.tblJobDescription?.title ?? "",
      },

      {
        field: "discipline",
        headerName: "Discipline",
        width: 140,
        // valueGetter: (row) => row.tblDiscipline?.name ?? "",
      },

      {
        field: "status",
        headerName: "Status",
        width: 120,
        // valueGetter: (row) => row.tblWorkOrderStatus?.name ?? "",
      },

      {
        field: "dueDate",
        headerName: "Due Date",
        width: 150,
        // valueGetter: (row) => row.dueDate ?? "",
      },

      {
        field: "completedDate",
        headerName: "Completed Date",
        width: 150,
        // valueGetter: (row) => row.completedDate ?? "",
      },

      {
        field: "overDue",
        headerName: "Over Due",
        width: 120,
      },

      {
        field: "pendingTop",
        headerName: "Pendying Top",
        width: 140,
        // valueGetter: (row) => row.pendingTop ?? "",
      },

      {
        field: "pendingDate",
        headerName: "Pendying Date",
        width: 150,
        // valueGetter: (row) => row.pendingDate ?? "",
      },
    ],
    []
  );

  return (
    <CustomizedDataGrid
      label={label ?? "Work Orders"}
      showToolbar
      rows={rows}
      columns={columns}
      loading={loading}
      onRefreshClick={handleRefresh}
      getRowId={(row) => row.workOrderId}
    />
  );
};

export default TabWorkOrder;
