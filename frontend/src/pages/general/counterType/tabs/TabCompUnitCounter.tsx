import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useCallback } from "react";
import { tblCompCounter, TypeTblCompCounter } from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";
import { useDataGrid } from "../../_hooks/useDataGrid";

interface TabComponentUnitProps {
  counterTypeId: number | null | undefined;
  label?: string | null;
}

const columns: GridColDef<TypeTblCompCounter>[] = [
  {
    field: "compNo",
    headerName: "Comp Name",
    flex: 1,
    valueGetter: (_, row) => row.tblComponentUnit?.compNo,
  },
  {
    field: "compTypeId",
    headerName: "Comp Type",
    flex: 1,
    valueGetter: (_, row) => row.tblComponentUnit?.compTypeId,
  },
  {
    field: "model",
    headerName: "Model",
    flex: 1,
    valueGetter: (_, row) => row.tblComponentUnit?.misc1,
  },
  {
    field: "serialNo",
    headerName: "Serial No",
    flex: 1,
    valueGetter: (_, row) => row.tblComponentUnit?.serialNo,
  },
  {
    field: "comment1",
    headerName: "Comment 1",
    flex: 1,
    valueGetter: (_, row) => row.tblComponentUnit?.userDefText1,
  },
  {
    field: "statusId",
    headerName: "Status",
    flex: 1,
    valueGetter: (_, row) => row.tblComponentUnit?.statusId,
  },
];

export default function TabCompUnitCounter(props: TabComponentUnitProps) {
  const { counterTypeId, label } = props;

  if (!counterTypeId) {
    return (
      <CustomizedDataGrid
        rows={[]}
        columns={columns}
        loading={false}
        label="Component"
        showToolbar
      />
    );
  }

  const getAll = useCallback(() => {
    return tblCompCounter.getAll({
      paginate: false,
      filter: { counterTypeId },
      include: { tblComponentUnit: true },
    });
  }, [counterTypeId]);

  const { rows, loading, fetchData } = useDataGrid(
    getAll,
    tblCompCounter.deleteById,
    "compCounterId"
  );

  return (
    <CustomizedDataGrid
      rows={rows}
      columns={columns}
      loading={loading}
      label={label || undefined}
      showToolbar
      onRefreshClick={fetchData} // query ثابت است
      getRowId={(row) => row.compCounterId}
    />
  );
}
