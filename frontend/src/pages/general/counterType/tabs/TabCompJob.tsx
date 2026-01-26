import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useCallback } from "react";
import { GridColDef } from "@mui/x-data-grid/";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import {
  tblCompJobCounter,
  TypeTblCompJobCounter,
} from "@/core/api/generated/api";

interface Props {
  counterTypeId: number | null | undefined;
  label?: string;
}

const getRowId = (row: TypeTblCompJobCounter) => row.compJobCounterId;

const columns: GridColDef<TypeTblCompJobCounter>[] = [
  {
    field: "jobDesc",
    headerName: "Job Description",
    flex: 1,
    // @ts-ignore
    valueGetter: (_, row) => row.tblCompJob?.tblJobDescription.jobDescTitle,
  },
  {
    field: "maintType",
    headerName: "Maint Type",
    width: 120,
    // @ts-ignore
    valueGetter: (_, row) => row.tblCompJob?.tblMaintType?.descr,
  },
  {
    field: "frequency",
    headerName: "Frequency",
    width: 120,
    valueGetter: (_, row) => row.frequency,
  },
  {
    field: "lastDoneCount",
    headerName: "Last Done Count",
    width: 140,
    valueGetter: (_, row) => row.lastDoneCount,
  },
  {
    field: "nextDueCount",
    headerName: "Next Due Count",
    width: 130,
    valueGetter: (_, row) => row.nextDueCount,
  },
  {
    field: "window",
    headerName: "Window",
    width: 80,
    valueGetter: (_, row) => row.window,
  },
];

export default function TabCompJobCounter(props: Props) {
  const { counterTypeId, label } = props;

  const getAll = useCallback(async () => {
    return tblCompJobCounter.getAll({
      filter: {
        tblCompCounter: {
          counterTypeId,
        },
      },
      include: {
        tblCompCounter: true,
        tblCompJob: {
          include: {
            tblJobDescription: true,
            tblMaintType: true,
          },
        },
      },
    });
  }, [counterTypeId]);

  const { rows, loading, fetchData } = useDataGrid(
    getAll,
    tblCompJobCounter.deleteById,
    "compJobCounterId",
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
