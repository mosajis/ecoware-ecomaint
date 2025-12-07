import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useCallback } from "react";
import { GridColDef } from "@mui/x-data-grid/";
import {
  tblCompCounter,
  tblCompJobCounter,
  TypeTblCompJobCounter,
} from "@/core/api/generated/api";
import { useDataGrid } from "@/shared/hooks/useDataGrid";

interface TabCompJobCounterProps {
  counterTypeId: number | null | undefined;
  label?: string | null;
}

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
    headerName: "Maint Type (set Rrel)",
    flex: 1,
    valueGetter: (_, row) => row.tblCompJob?.maintTypeId,
  },
  {
    field: "frequency",
    headerName: "Frequency",
    flex: 1,
    valueGetter: (_, row) => row.frequency,
  },
  {
    field: "lastDoneCount",
    headerName: "Last Done Count",
    flex: 1,
    valueGetter: (_, row) => row.lastDoneCount,
  },
  {
    field: "nextDueCount",
    headerName: "Next Due Count",
    flex: 1,
    valueGetter: (_, row) => row.nextDueCount,
  },
  {
    field: "window",
    headerName: "Window",
    flex: 1,
    valueGetter: (_, row) => row.window,
  },
];

export default function TabCompJobCounter(props: TabCompJobCounterProps) {
  const { counterTypeId, label } = props;

  if (!counterTypeId) {
    return (
      <CustomizedDataGrid
        rows={[]}
        columns={columns}
        loading={false}
        label="Job Counters"
        showToolbar
      />
    );
  }

  // const getAll = useCallback(async () => {
  //   // select * from tblcomponentumit where compid in (1001,1002,1003)
  //   const compCounters = await tblCompCounter.getAll({
  //     filter: { counterTypeId },
  //   });

  //   const compCountersIds = compCounters.items.map((i) => i.compCounterId);

  //   return tblCompJobCounter.getAll({
  //     filter: {
  //       compCounterId: {
  //         in: compCountersIds,
  //       },
  //     },
  //     include: {
  //       tblCompCounter: true,
  //       tblCompJob: {
  //         include: {
  //           tblJobDescription: true,
  //         },
  //       },
  //     },
  //   });
  // }, [counterTypeId]);

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
          },
        },
      },
    });
  }, [counterTypeId]);

  const { rows, loading, fetchData } = useDataGrid(
    getAll,
    tblCompJobCounter.deleteById,
    "compJobCounterId"
  );

  return (
    <CustomizedDataGrid
      rows={rows}
      columns={columns}
      loading={loading}
      label={label || undefined}
      showToolbar
      onRefreshClick={fetchData}
      getRowId={(row) => row.compJobCounterId}
    />
  );
}
