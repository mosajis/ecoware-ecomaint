import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useCallback } from "react";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import {
  tblCompJobTrigger,
  tblComponentUnit,
  tblDiscipline,
  tblPeriod,
  TypeTblCompJob,
  TypeTblCompJobTrigger,
} from "@/core/api/generated/api";
import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";
import CellFrequency from "@/shared/components/dataGrid/cells/CellFrequency";
import { GridColDef } from "@mui/x-data-grid";

interface Props {
  jobTriggerId?: number | null;
  label?: string;
}

const getRowId = (row: TypeTblCompJob) => row.compJobId;

const columns: GridColDef<TypeTblCompJobTrigger>[] = [
  {
    field: "compNo",
    headerName: "Component",
    flex: 2,
    // @ts-ignore
    valueGetter: (value, row) => row.tblCompJob?.tblComponentUnit?.compNo,
  },

  {
    field: "compTypeName",
    headerName: "CompType",
    flex: 1,
    valueGetter: (value, row) =>
      // @ts-ignore
      row.tblCompJob?.tblComponentUnit?.tblCompType?.compName,
  },

  {
    field: "jobCode",
    headerName: "Job Code",
    width: 100,
    // @ts-ignore
    valueGetter: (value, row) => row.tblCompJob?.tblJobDescription?.jobDescCode,
  },

  {
    field: "jobTitle",
    headerName: "Job Title",
    flex: 1,
    valueGetter: (value, row) =>
      // @ts-ignore
      row?.tblCompJob?.tblJobDescription?.jobDescTitle,
  },

  {
    field: "discipline",
    headerName: "Discipline",
    width: 100,
    // @ts-ignore
    valueGetter: (value, row) => row?.tblCompJob?.tblDiscipline?.name,
  },

  {
    field: "frequency",
    headerName: "Frequency",
    valueGetter: (value, row) => row?.tblCompJob?.frequency,
    renderCell: ({ row, value }) => (
      <CellFrequency
        frequency={value}
        frequencyPeriod={row?.tblCompJob?.tblPeriod as any}
      />
    ),
  },

  {
    field: "lastDone",
    headerName: "Last Done",
    width: 150,
    valueGetter: (value, row) => row?.tblCompJob?.lastDone,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
  {
    field: "nextDueDate",
    headerName: "Next Due Date",
    width: 150,
    valueGetter: (value, row) => row?.tblCompJob?.nextDueDate,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
];
export default function TabComponentJob(props: Props) {
  const { jobTriggerId, label } = props;
  const getAll = useCallback(() => {
    return tblCompJobTrigger.getAll({
      filter: {
        jobTriggerId: jobTriggerId,
      },
      include: {
        tblCompJob: {
          include: {
            tblPeriod: true,
            tblDiscipline: true,
            tblJobDescription: true,
            tblComponentUnit: {
              include: {
                tblCompType: true,
              },
            },
          },
        },
      },
    });
  }, [jobTriggerId]);

  const { rows, loading, handleRefresh } = useDataGrid(
    getAll,
    tblComponentUnit.deleteById,
    "compJobId",
    !!jobTriggerId,
  );

  return (
    <CustomizedDataGrid
      disableAdd
      disableEdit
      disableDelete
      disableRowSelectionOnClick
      disableRowNumber
      rows={rows}
      columns={columns}
      loading={loading}
      label={label}
      showToolbar={!!label}
      onRefreshClick={handleRefresh}
      getRowId={getRowId}
    />
  );
}
