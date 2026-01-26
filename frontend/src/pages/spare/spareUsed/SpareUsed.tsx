import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { GridColDef } from "@mui/x-data-grid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { useCallback } from "react";
import {
  tblMaintLog,
  tblMaintLogStocks,
  tblSpareType,
  tblSpareUnit,
  TypeTblMaintLog,
  TypeTblMaintLogStocks,
} from "@/core/api/generated/api";
import Splitter from "@/shared/components/Splitter/Splitter";

const getRowId = (row: TypeTblMaintLogStocks) => row.maintLogStockId;

const columns: GridColDef<TypeTblMaintLogStocks>[] = [
  {
    field: "partName",
    headerName: "Part Name",
    flex: 1,
  },
  {
    field: "maker",
    headerName: "Maker",
    flex: 1,
  },
  {
    field: "totalCount",
    headerName: "Total Count",
    flex: 1,
  },
  {
    field: "totalUse",
    headerName: "Total Use",
    flex: 1,
  },
  {
    field: "partNo",
    headerName: "Part No",
    flex: 1,
  },
  {
    field: "extraNo",
    headerName: "Extra No",
    flex: 1,
  },
  {
    field: "notes",
    headerName: "Notes",
    flex: 1,
  },
  {
    field: "description",
    headerName: "Description",
    flex: 1,
  },
  {
    field: "unitName",
    headerName: "Unit Name",
    flex: 5,
    // @ts-ignore
    valueGetter: (_, row) => row.tblSpareUnit.tblSpareType.name,
  },
];

export default function PageStockUsed() {
  const getAll = useCallback(() => {
    return tblMaintLogStocks.getAll({
      filter: {},
      include: {
        tblSpareUnit: {
          include: {
            tblSpareType: true,
          },
        },
      },
    });
  }, []);

  const { rows, loading, handleRefresh } = useDataGrid(
    getAll,
    tblMaintLog.deleteById,
    "maintLogStockId",
  );

  return (
    <Splitter horizontal>
      <CustomizedDataGrid
        showToolbar
        disableEdit
        disableDelete
        disableAdd
        disableRefresh
        label="Spare Used"
        loading={loading}
        rows={rows}
        columns={columns}
        onRefreshClick={handleRefresh}
        getRowId={getRowId}
      />
      <CustomizedDataGrid
        showToolbar
        disableEdit
        disableDelete
        disableAdd
        disableRefresh
        label="MaintLog"
        loading={loading}
        rows={rows}
        columns={columns}
        onRefreshClick={handleRefresh}
        getRowId={getRowId}
      />
    </Splitter>
  );
}
