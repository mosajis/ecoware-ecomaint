import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";
import { useCallback } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import {
  tblReScheduleLog,
  TypeTblReScheduleLog,
  TypeTblWorkOrder,
} from "@/core/api/generated/api";

interface Props {
  workOrder?: TypeTblWorkOrder;
  label?: string;
}

const getRowId = (row: TypeTblReScheduleLog) => row.rescheduleLogId;

// === Columns ===
const columns: GridColDef<TypeTblReScheduleLog>[] = [
  {
    field: "fromDueDate",
    headerName: "From Due Date",
    flex: 1,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
  {
    field: "toDueDate",
    headerName: "To Due Date",
    flex: 1,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
  {
    field: "rescheduledDate",
    headerName: "Re Schedule Date",
    flex: 1,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
  {
    field: "rescheduledBy",
    headerName: "Username SET REL",
    flex: 1,
  },
  {
    field: "reason",
    headerName: "Reason",
    flex: 1,
  },
];

const TabRescheduleLog = ({ workOrder, label }: Props) => {
  const workOrderId = workOrder?.workOrderId;

  const getAll = useCallback(() => {
    return tblReScheduleLog.getAll({
      filter: {
        workOrderId,
      },
    });
  }, [workOrderId]);

  // === useDataGrid ===
  const { rows, loading, handleRefresh } = useDataGrid(
    getAll,
    tblReScheduleLog.deleteById,
    "rescheduleLogId",
    !!workOrderId,
  );

  return (
    <CustomizedDataGrid
      disableAdd
      disableEdit
      disableDelete
      showToolbar={!!label}
      label={label}
      rows={rows}
      columns={columns}
      loading={loading}
      onRefreshClick={handleRefresh}
      getRowId={getRowId}
    />
  );
};

export default TabRescheduleLog;
