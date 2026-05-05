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

export default function PageSpareUsed() {
  const [selectedSpareUnitId, setSelectedSpareUnitId] = useState<number | null>(
    null,
  );

  // === LEFT GRID (Spare Used)
  const getAllSpareUsed = useCallback(() => {
    return tblMaintLogSpareBySpareUnitId();
  }, []);

  const {
    rows: spareRows,
    loading: spareLoading,
    handleRefresh: refreshSpare,
  } = useDataGrid<any>(
    getAllSpareUsed,
    tblMaintLog.deleteById,
    "maintLogStockId",
  );

  // === RIGHT GRID (MaintLog - dependent)
  const getAllMaintLog = useCallback(() => {
    return tblMaintLogSpare.getAll({
      include: {
        tblMaintLog: {
          include: {
            tblComponentUnit: {
              include: { tblCompStatus: true },
            },
            tblWorkOrder: true,
            tblMaintClass: true,
            tblJobDescription: true,
          },
        },
      },
      filter: {
        spareUnitId: selectedSpareUnitId,
      },
    });
  }, [selectedSpareUnitId]);

  const {
    rows: maintLogRows,
    loading: maintLogLoading,
    handleRefresh: refreshMaintLog,
  } = useDataGrid(
    getAllMaintLog,
    tblMaintLog.deleteById,
    "maintLogId",
    !!selectedSpareUnitId,
  );

  // === Handlers
  const handleRowClick = useCallback(
    ({ row }: { row: TypeTblMaintLogSpare }) => {
      setSelectedSpareUnitId(row.spareUnitId);
    },
    [],
  );

  return (
    <Splitter horizontal>
      {/* === LEFT: Spare Used */}
      <CustomizedDataGrid
        showToolbar
        disableEdit
        disableDelete
        disableAdd
        label="Spare Used"
        loading={spareLoading}
        rows={spareRows}
        columns={columns}
        onRefreshClick={refreshSpare}
        getRowId={getRowId}
        onRowClick={handleRowClick}
      />

      {/* === RIGHT: Maint Log */}
      <CustomizedDataGrid
        showToolbar
        disableEdit
        disableDelete
        disableAdd
        disableRefresh
        label="Maint Log"
        loading={maintLogLoading}
        rows={maintLogRows}
        columns={maintLogColumns}
        onRefreshClick={refreshMaintLog}
        getRowId={maintLogGetRowId}
      />
    </Splitter>
  );
}
