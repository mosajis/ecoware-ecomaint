import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useCallback } from "react";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import {
  tblSpareUnit,
  TypeTblComponentUnit,
  TypeTblSpareUnit,
} from "@/core/api/generated/api";

interface Props {
  componentUnit?: TypeTblComponentUnit;
  label?: string;
}

const getRowId = (row: TypeTblSpareUnit) => row.spareUnitId;

const columns = [
  { field: "mescCode", headerName: "MESC Code", flex: 1 },
  { field: "extraNo", headerName: "Extra No", flex: 1 },
  { field: "partName", headerName: "Part Name", flex: 1 },
  { field: "qyt", headerName: "QYT", flex: 1 },
  { field: "unitName", headerName: "Unit Name", flex: 1 },
  { field: "totalMainLogs", headerName: "Total Main Logs", flex: 1 },
];

const TabStockUsed = ({ componentUnit, label }: Props) => {
  const compId = componentUnit?.compId;

  const getAll = useCallback(
    () =>
      tblSpareUnit.getAll({
        filter: {
          // compId,
        },
        include: {
          tblSpareType: true,
        },
      }),
    [],
  );

  const { rows, loading, handleRefresh } = useDataGrid(
    getAll,
    tblSpareUnit.deleteById,
    "spareUnitId",
    !!compId,
  );

  return (
    <CustomizedDataGrid
      disableEdit
      disableDelete
      disableRowNumber
      disableRowSelectionOnClick
      label={label}
      showToolbar={!!label}
      rows={rows}
      columns={columns}
      loading={loading}
      onRefreshClick={handleRefresh}
      getRowId={getRowId}
    />
  );
};

export default TabStockUsed;
