import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useCallback } from "react";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { GridColDef } from "@mui/x-data-grid";
import {
  tblCompCounter,
  TypeTblCompCounter,
  TypeTblFunctions,
} from "@/core/api/generated/api";

const getRowId = (row: TypeTblCompCounter) => row.compCounterId;

const columns: GridColDef<TypeTblCompCounter>[] = [
  {
    field: "counterType",
    headerName: "Counter Type",
    flex: 1,
    valueGetter: (_, row) => row.tblCounterType?.name || "",
  },
  {
    field: "currentValue",
    headerName: "Current Value",
    flex: 1,
  },
  {
    field: "currentDate",
    headerName: "Current Date",
    width: 130,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
  {
    field: "startValue",
    headerName: "Start Value",
    flex: 1,
  },
  {
    field: "currentDate",
    headerName: "Current Date",
    width: 130,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
  {
    field: "averageCountRate",
    headerName: "Avg Rate",
    flex: 1,
  },
  {
    field: "orderNo",
    headerName: "Order No",
    width: 85,
  },
];

interface Props {
  recordFunction?: TypeTblFunctions;
  label?: string;
}

const TabCounter = ({ recordFunction, label }: Props) => {
  const compId = recordFunction?.tblComponentUnit?.compId;

  const getAll = useCallback(() => {
    return tblCompCounter.getAll({
      include: {
        tblCounterType: true,
      },
      filter: {
        compId,
      },
    });
  }, [compId]);

  const { rows, loading, handleRefresh } = useDataGrid(
    getAll,
    tblCompCounter.deleteById,
    "compCounterId",
    !!compId,
  );

  return (
    <CustomizedDataGrid
      disableRowSelectionOnClick
      disableRowNumber
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

export default TabCounter;
