import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useCallback } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import {
  tblCompTypeJobCounter,
  TypeTblCompTypeJobCounter,
} from "@/core/api/generated/api";

interface Props {
  counterTypeId: number | null | undefined;
  label?: string;
}

const getRowId = (row: TypeTblCompTypeJobCounter) => row.compTypeJobCounterId;

const columns: GridColDef<TypeTblCompTypeJobCounter>[] = [
  {
    field: "jobDescId",
    headerName: "Job Desc",
    flex: 1,
    valueGetter: (_, row) =>
      // @ts-ignore
      row.tblCompTypeJob?.tblJobDescription?.jobDescTitle,
  },
  {
    field: "compTypeCounter",
    headerName: "Counter Type",
    flex: 1,
    // @ts-ignore
    valueGetter: (_, row) => row?.tblCompTypeCounter?.tblCompType?.compName,
  },
  {
    field: "maintType",
    headerName: "Maint Type",
    width: 100,
    // @ts-ignore
    valueGetter: (_, row) => row.tblCompTypeJob?.tblMaintType.descr,
  },
  {
    field: "frequency",
    headerName: "Frequency",
    width: 100,
    valueGetter: (_, row) => row.frequency,
  },
];

export default function TabCompTypeJobCounter(props: Props) {
  const { counterTypeId, label } = props;

  const getAll = useCallback(async () => {
    return tblCompTypeJobCounter.getAll({
      filter: {
        tblCompTypeCounter: {
          counterTypeId,
        },
      },
      include: {
        tblCompTypeCounter: {
          include: { tblCompType: true },
        },
        tblCompTypeJob: {
          include: {
            tblMaintType: true,
            tblJobDescription: true,
          },
        },
      },
    });
  }, [counterTypeId]);

  const { rows, loading, fetchData } = useDataGrid(
    getAll,
    tblCompTypeJobCounter.deleteById,
    "compTypeJobCounterId",
    !!counterTypeId,
  );

  return (
    <CustomizedDataGrid
      disableEdit
      disableDelete
      disableRowSelectionOnClick
      rows={rows}
      columns={columns}
      loading={loading}
      label={label}
      showToolbar={!!label}
      onRefreshClick={fetchData}
      getRowId={getRowId}
    />
  );
}
