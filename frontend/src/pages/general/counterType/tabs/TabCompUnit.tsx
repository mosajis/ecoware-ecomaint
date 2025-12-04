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
    headerName: "Component",
    flex: 1,
    valueGetter: (_, row) => row.tblComponentUnit?.compNo,
  },
  {
    field: "compTypeId",
    headerName: "CompType",
    flex: 1,
    // @ts-ignore
    valueGetter: (_, row) => row.tblComponentUnit?.tblCompType?.compName,
  },
  {
    field: "model",
    headerName: "Model",
    flex: 1,
    valueGetter: (_, row) => row.tblComponentUnit?.misc1,
  },
  {
    field: "serialNo",
    headerName: "SerialNo",
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
    // @ts-ignore
    valueGetter: (_, row) =>
      row.tblComponentUnit?.tblCompStatus?.compStatusName,
  },
];

export default function TabCompUnitCounter(props: TabComponentUnitProps) {
  const { counterTypeId, label } = props;

  const getAll = useCallback(() => {
    return tblCompCounter.getAll({
      filter: { counterTypeId },
      include: {
        tblComponentUnit: {
          include: {
            tblCompType: true,
            tblCompStatus: true,
          },
        },
      },
    });
  }, [counterTypeId]);

  const { rows, loading, handleRefresh } = useDataGrid(
    getAll,
    tblCompCounter.deleteById,
    "compCounterId",
    !!counterTypeId
  );

  return (
    <CustomizedDataGrid
      rows={rows}
      columns={columns}
      loading={loading}
      label={label || "Component"}
      showToolbar
      onRefreshClick={handleRefresh}
      getRowId={(row) => row.compCounterId}
    />
  );
}
