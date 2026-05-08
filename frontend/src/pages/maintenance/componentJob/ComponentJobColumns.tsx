import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";
import CellFrequency from "@/shared/components/dataGrid/cells/CellFrequency";
import CellLink from "@/shared/components/dataGrid/cells/CellLink";
import { RouteDetail as RouteComponentUnitDetail } from "../componentUnit/ComponentUnitRoutes";
import { RouteDetail as RouteComponentTypeDetail } from "../componentType/ComponentTypeRoutes";
import { TypeTblCompJob } from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";

export const getRowId = (row: TypeTblCompJob) => row.compJobId;

export const columns: GridColDef<TypeTblCompJob>[] = [
  {
    field: "compNo",
    headerName: "Component",
    flex: 2,
    valueGetter: (value, row) => row.tblComponentUnit?.compNo,
    renderCell: ({ value, row }) => (
      <CellLink
        breadcrumb={value}
        value={value}
        to={RouteComponentUnitDetail.to}
        params={{ id: row.compId }}
      />
    ),
  },

  {
    field: "compTypeName",
    headerName: "CompType",
    flex: 1,
    // @ts-ignore
    valueGetter: (value, row) => row.tblComponentUnit?.tblCompType.compName,
    renderCell: ({ value, row }) => (
      <CellLink
        breadcrumb={value}
        value={value}
        to={RouteComponentTypeDetail.to}
        // @ts-ignore
        params={{ id: row.tblCompJobTriggers?.tblCompType?.compTypeId }}
      />
    ),
  },

  {
    field: "jobCode",
    headerName: "Job Code",
    width: 100,
    valueGetter: (value, row) => row.tblJobDescription?.jobDescCode,
  },

  {
    field: "jobTitle",
    headerName: "Job Title",
    flex: 1,
    valueGetter: (value, row) => row.tblJobDescription?.jobDescTitle,
  },

  {
    field: "discipline",
    headerName: "Discipline",
    width: 100,
    valueGetter: (value, row) => row.tblDiscipline?.name,
  },

  {
    field: "frequency",
    headerName: "Frequency",
    renderCell: ({ row, value }) => (
      <CellFrequency frequency={value} frequencyPeriod={row.tblPeriod} />
    ),
  },

  {
    field: "lastDone",
    headerName: "Last Done",
    width: 150,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
  {
    field: "nextDueDate",
    headerName: "Next Due Date",
    width: 150,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
];
