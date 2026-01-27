import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";
import Splitter from "@/shared/components/Splitter/Splitter";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { GridColDef } from "@mui/x-data-grid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { useCallback, useState } from "react";
import { tblMaintLogStocksBySpareUnitId } from "@/core/api/api";
import {
  tblMaintLog,
  tblMaintLogStocks,
  TypeTblMaintLog,
  TypeTblMaintLogStocks,
} from "@/core/api/generated/api";

const getRowId = (row: TypeTblMaintLogStocks) => row.maintLogStockId;
const maintLogGetRowId = (row: TypeTblMaintLog) => row.maintLogId;

const columns: GridColDef<TypeTblMaintLogStocks>[] = [
  {
    field: "partName",
    headerName: "Part Name",
    flex: 1,
    // @ts-ignore
    valueGetter: (_, row) => row.tblSpareUnit.tblSpareType.name,
  },
  {
    field: "totalCount",
    headerName: "Total Count",
    width: 130,
  },
  {
    field: "totalUse",
    headerName: "Total Use",
    width: 130,
  },
  {
    field: "partTypeNo",
    headerName: "MESC Code",
    flex: 1,
    // @ts-ignore
    valueGetter: (_, row) => row?.tblSpareUnit?.tblSpareType.partTypeNo,
  },
  {
    field: "makerRefNo",
    headerName: "Maker Ref",
    flex: 1,
    // @ts-ignore
    valueGetter: (_, row) => row?.tblSpareUnit?.tblSpareType.makerRefNo,
  },
  {
    field: "extraNo",
    headerName: "Extra No",
    flex: 1,
    // @ts-ignore
    valueGetter: (_, row) => row?.tblSpareUnit?.tblSpareType.extraNo,
  },
  {
    field: "note",
    headerName: "Note",
    flex: 1,
    // @ts-ignore
    valueGetter: (_, row) => row?.tblSpareUnit?.tblSpareType.note,
  },
  {
    field: "unit",
    headerName: "Unit",
    flex: 1,
    // @ts-ignore
    valueGetter: (_, row) => row?.tblSpareUnit?.tblSpareType?.tblUnit?.name,
  },
];

const maintLogColumns: GridColDef<TypeTblMaintLogStocks>[] = [
  {
    field: "component",
    headerName: "Component",
    flex: 1,
    // @ts-ignore
    valueGetter: (_, row) => row?.tblMaintLog?.tblComponentUnit?.compNo,
  },
  {
    field: "jobCode",
    headerName: "JobCode",
    width: 100,
    // @ts-ignore
    valueGetter: (_, row) => row?.tblMaintLog?.tblJobDescription?.jobDescCode,
  },
  {
    field: "jobDescTitle",
    headerName: "jobDescTitle",
    flex: 1,
    // @ts-ignore
    valueGetter: (_, row) => row?.tblMaintLog?.tblJobDescription?.jobDescTitle,
  },
  {
    field: "dateDone",
    headerName: "DateDone",
    width: 130,
    valueGetter: (_, row) => row?.tblMaintLog?.dateDone,

    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
  {
    field: "maintClass",
    headerName: "Maint Class",
    // @ts-ignore
    valueGetter: (_, row) => row?.tblMaintLog?.tblMaintClass?.descr ?? "",
  },
  {
    field: "downTime",
    headerName: "DownTime",
    valueGetter: (_, row) => row?.tblMaintLog?.downTime,
    width: 130,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },

  {
    field: "unplanned",
    headerName: "Unplanned",
    valueGetter: (_, row) => row?.tblMaintLog?.unplanned,
    type: "boolean",
    width: 95,
  },
];

export default function PageStockUsed() {
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  // MaintLog Stocks
  const getAll = useCallback(() => {
    return tblMaintLogStocksBySpareUnitId();
  }, []);

  const { rows, loading, handleRefresh } = useDataGrid<any>(
    getAll,
    tblMaintLog.deleteById,
    "maintLogStockId",
  );

  // MaintLog
  const getAllMaintLog = useCallback(() => {
    return tblMaintLogStocks.getAll({
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
    ({ row }: { row: TypeTblMaintLogStocks }) => {
      setSelectedRowId(row.stockItemId);
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
