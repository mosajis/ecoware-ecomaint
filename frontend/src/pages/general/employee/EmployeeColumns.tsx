import { TypeTblEmployee } from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";

export const getRowId = (row: TypeTblEmployee) => row.employeeId;

export const columns: GridColDef<TypeTblEmployee>[] = [
  { field: "code", headerName: "Code", width: 60 },
  { field: "lastName", headerName: "Last Name", flex: 1 },
  { field: "firstName", headerName: "First Name", flex: 1 },
  {
    field: "address",
    headerName: "Address",
    flex: 1,
    valueGetter: (v, row) => row.tblAddress?.name,
  },
  {
    field: "discipline",
    headerName: "Discipline",
    flex: 1,
    valueGetter: (v, row) => row.tblDiscipline?.name,
  },
  { field: "orderNo", headerName: "Order No", width: 80 },
];
