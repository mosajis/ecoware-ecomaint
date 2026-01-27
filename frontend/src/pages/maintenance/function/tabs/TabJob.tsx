import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";
import CellFrequency from "@/shared/components/dataGrid/cells/CellFrequency";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { useCallback } from "react";
import { GridColDef } from "@mui/x-data-grid";

import {
  tblCompJob,
  TypeTblCompJob,
  TypeTblFunctions,
} from "@/core/api/generated/api";

interface Props {
  recordFunction?: TypeTblFunctions;
  label?: string;
}

const getRowId = (row: TypeTblCompJob) => row.compJobId;

const columns: GridColDef<TypeTblCompJob>[] = [
  {
    field: "jobDescCode",
    headerName: "Code",
    width: 100,
    valueGetter: (_, row) => row.tblJobDescription?.jobDescCode,
  },
  {
    field: "jobDescTitle",
    headerName: "Job Title",
    flex: 1,
    valueGetter: (_, row) => row.tblJobDescription?.jobDescTitle,
  },
  {
    field: "discipline",
    headerName: "Discipline",
    flex: 1,
    valueGetter: (_, row) => row.tblDiscipline?.name ?? "",
  },
  {
    field: "frequency",
    headerName: "Frequency",
    width: 150,
    renderCell: ({ row, value }) => (
      <CellFrequency frequency={value} frequencyPeriod={row.tblPeriod} />
    ),
  },
  {
    field: "lastDone",
    headerName: "Last Done",
    width: 130,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
  {
    field: "nextDueDate",
    headerName: "Next Due Date",
    width: 130,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
];

const TabJob = ({ recordFunction, label }: Props) => {
  const compId = recordFunction?.tblComponentUnit?.compId;

  const getAll = useCallback(
    () =>
      tblCompJob.getAll({
        include: {
          tblPeriod: true,
          tblDiscipline: true,
          tblJobDescription: true,
        },
        filter: {
          compId,
        },
      }),
    [compId],
  );
  // --- useDataGrid ---
  const { rows, loading, handleRefresh } = useDataGrid(
    getAll,
    tblCompJob.deleteById,
    "compJobId",
    !!compId,
  );
  return (
    <>
      <CustomizedDataGrid
        disableRowNumber
        disableAdd
        disableRowSelectionOnClick
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
    </>
  );
};

export default TabJob;
