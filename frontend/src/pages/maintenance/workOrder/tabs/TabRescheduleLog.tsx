import Splitter from "@/shared/components/Splitter/Splitter";
import Editor from "@/shared/components/Editor";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useCallback, useState } from "react";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import {
  tblReScheduleLog,
  TypeTblReScheduleLog,
  TypeTblWorkOrder,
} from "@/core/api/generated/api";
import { columns, getRowId } from "./TabRescheduleLogColumns";

interface Props {
  workOrder?: TypeTblWorkOrder;
  label?: string;
}

const TabRescheduleLog = ({ workOrder, label }: Props) => {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  const workOrderId = workOrder?.workOrderId;

  const getAll = useCallback(() => {
    return tblReScheduleLog.getAll({
      include: {
        tblEmployee: true,
      },
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

  const handleRowClick = useCallback(
    ({ row }: { row: TypeTblReScheduleLog }) => {
      setSelectedReason(row.reason);
    },
    [],
  );

  return (
    <Splitter initialPrimarySize="60%">
      <CustomizedDataGrid
        disableAdd
        disableEdit
        disableDelete
        showToolbar={!!label}
        label={label}
        rows={rows}
        columns={columns}
        loading={loading}
        onRowClick={handleRowClick}
        onRefreshClick={handleRefresh}
        getRowId={getRowId}
      />
      <Editor label="Reason" readOnly disabled initValue={selectedReason} />
    </Splitter>
  );
};

export default TabRescheduleLog;
