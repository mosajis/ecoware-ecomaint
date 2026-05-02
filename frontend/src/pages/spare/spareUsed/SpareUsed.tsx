import Splitter from "@/shared/components/Splitter/Splitter";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { useCallback, useState } from "react";
import { tblMaintLogSpareBySpareUnitId } from "@/core/api/api";
import {
  tblMaintLog,
  tblMaintLogSpare,
  TypeTblMaintLogSpare,
} from "@/core/api/generated/api";
import {
  columns,
  getRowId,
  maintLogColumns,
  maintLogGetRowId,
} from "./SpareUsedColumns";

export default function PageStockUsed() {
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  // MaintLog Spare
  const getAll = useCallback(() => {
    return tblMaintLogSpareBySpareUnitId();
  }, []);

  const { rows, loading, handleRefresh } = useDataGrid<any>(
    getAll,
    tblMaintLog.deleteById,
    "maintLogStockId",
  );

  // MaintLog
  const getAllMaintLog = useCallback(() => {
    return tblMaintLogSpare.getAll({
      include: {
        tblMaintLog: {
          include: {
            tblComponentUnit: {
              include: {
                tblCompStatus: true,
              },
            },
            tblWorkOrder: true,
            tblMaintClass: true,
            tblJobDescription: true,
          },
        },
      },
      filter: {
        stockItemId: selectedRowId,
      },
    });
  }, [selectedRowId]);

  const {
    rows: maintLogRows,
    loading: maintLogLoading,
    handleRefresh: maintLogHandleRefresh,
  } = useDataGrid(
    getAllMaintLog,
    tblMaintLog.deleteById,
    "maintLogId",
    !!selectedRowId,
  );

  const handleRowClick = useCallback(
    ({ row }: { row: TypeTblMaintLogSpare }) => {
      setSelectedRowId(row.spareUnitId);
    },
    [],
  );
  return (
    <Splitter horizontal>
      <CustomizedDataGrid
        showToolbar
        disableEdit
        disableDelete
        disableAdd
        label="Spare Used"
        loading={loading}
        rows={rows}
        columns={columns}
        onRefreshClick={handleRefresh}
        getRowId={getRowId}
        onRowClick={handleRowClick}
      />
      <CustomizedDataGrid
        showToolbar
        disableEdit
        disableDelete
        disableAdd
        disableRefresh
        label="MaintLog"
        loading={maintLogLoading}
        rows={maintLogRows}
        columns={maintLogColumns}
        onRefreshClick={maintLogHandleRefresh}
        getRowId={maintLogGetRowId}
      />
    </Splitter>
  );
}
