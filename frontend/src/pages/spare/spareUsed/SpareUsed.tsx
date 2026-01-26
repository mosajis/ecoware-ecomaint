import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";
import { GridColDef } from "@mui/x-data-grid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { useCallback } from "react";
import {
  tblMaintLogStocks,
  TypeTblMaintLogStocks,
} from "@/core/api/generated/api";

const getRowId = (row: TypeTblMaintLogStocks) => row.maintLogStockId;

const columns: GridColDef<TypeTblMaintLogStocks>[] = [
  {
    field: "tblMaintLog",
    headerName: "Component",
    flex: 1,
    // @ts-ignore
    valueGetter: (_, row) => row?.tblMaintLog?.tblComponentUnit?.compNo,
  },
  {
    field: "jobCode",
    headerName: "Job Code",
    flex: 1,
    // @ts-ignore
    valueGetter: (_, row) => row?.tblMaintLog?.tblJobDescription?.jobDescCode,
  },
  {
    field: "jobName",
    headerName: "Job Name",
    flex: 1,
    // @ts-ignore
    valueGetter: (_, row) => row?.tblMaintLog?.tblJobDescription?.jobDescTitle,
  },
  {
    field: "dateDone",
    headerName: "Date Done",
    width: 150,
    valueGetter: (_, row) => row?.tblMaintLog?.dateDone,
    // @ts-ignore
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
  {
    field: "discipline",
    headerName: "Discipline",
    width: 120,
    valueGetter: (_, row) =>
      // @ts-ignore
      row.tblMaintLog?.tblWorkOrder?.tblCompJob?.tblDiscipline?.name,
  },
  {
    field: "followStatus",
    headerName: "Follow Status",
    width: 120,
    valueGetter: (_, row) =>
      // @ts-ignore
      row.tblMaintLog?.tblFollowStatus?.fsName,
  },
  {
    field: "maintClass",
    headerName: "Maint Class",
    width: 120,
    valueGetter: (_, row) =>
      // @ts-ignore
      row.tblMaintLog?.tblMaintClass?.descr,
  },
  {
    field: "downTime",
    headerName: "Down Time (Min)",
    width: 120,
    valueGetter: (_, row) => row.tblMaintLog?.totalDuration,
  },
  {
    field: "isUnplanned",
    headerName: "Is Unplanned",
    width: 120,
    // @ts-ignore
    valueGetter: (_, row) => row.tblMaintLog?.tblWorkOrder?.unexpected,
    type: "boolean",
  },
  {
    field: "stockCount",
    headerName: "Stock Count",
    width: 120,
  },
];

export default function PageStockUsed() {
  const getAll = useCallback(() => {
    return tblMaintLogStocks.getAll({
      include: {
        tblMaintLog: {
          include: {
            tblFollowStatus: true,
            tblMaintClass: true,
            tblWorkOrder: {
              include: {
                tblCompJob: {
                  include: {
                    tblDiscipline: true,
                  },
                },
              },
            },
            tblJobDescription: true,
            tblComponentUnit: true,
          },
        },
        tblStockItem: true,
      },
    });
  }, []);

  const { rows, loading, handleRefresh } = useDataGrid(
    getAll,
    tblMaintLogStocks.deleteById,
    "maintLogStockId",
  );

  return (
    <CustomizedDataGrid
      showToolbar
      disableEdit
      disableDelete
      label="Stock Used"
      loading={loading}
      rows={rows}
      columns={columns}
      onRefreshClick={handleRefresh}
      getRowId={getRowId}
    />
  );
}
