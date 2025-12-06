import { useCallback, useMemo } from "react";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import {
  tblCompTypeCounter,
  TypeTblCompTypeCounter,
} from "@/core/api/generated/api";
import { useDataGrid } from "@/pages/general/_hooks/useDataGrid";
import { GridColDef } from "@mui/x-data-grid";

type Props = {
  selected?: number | null;
};

const TabCounter = ({ selected }: Props) => {
  // === getAll callback ===
  const getAll = useCallback(() => {
    if (!selected) return Promise.resolve({ items: [] });

    return tblCompTypeCounter.getAll({
      include: {
        tblCounterType: true,
        tblCompTypeJobCounters: true,
      },
      filter: {
        compTypeId: selected,
      },
    });
  }, [selected]);

  // === useDataGrid ===
  const { rows, loading, fetchData, handleDelete } = useDataGrid(
    getAll,
    tblCompTypeCounter.deleteById,
    "compTypeCounterId"
  );

  // === Columns ===
  const columns = useMemo<GridColDef<TypeTblCompTypeCounter>[]>(
    () => [
      {
        field: "counterType",
        headerName: "Counter Type",
        flex: 1,
        valueGetter: (v, row) => row.tblCounterType?.name || "",
      },
    ],
    []
  );

  return (
    <CustomizedDataGrid
      label="Counter"
      rows={rows}
      columns={columns}
      loading={loading}
      showToolbar
      onRefreshClick={fetchData}
      getRowId={(row) => row.compTypeCounterId}
    />
  );
};

export default TabCounter;
