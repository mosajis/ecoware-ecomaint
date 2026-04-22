import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";
import { TypeTblUser } from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";

export const getRowId = (row: TypeTblUser) => row.userId;

export const columns: GridColDef<TypeTblUser>[] = [
  {
    field: "userName",
    headerName: "Username",
    flex: 1,
  },
  {
    field: "lastName",
    headerName: "LastName",
    valueGetter: (_, row) => row.tblEmployee?.lastName,
    flex: 1,
  },
  {
    field: "firstName",
    headerName: "FirstName",
    valueGetter: (_, row) => row.tblEmployee?.firstName,
    flex: 1,
  },
  {
    field: "title",
    headerName: "Title",
    valueGetter: (_, row) => row.tblEmployee?.title,
    flex: 1,
  },
  {
    field: "userGroup",
    headerName: "User Group",
    valueGetter: (_, row) => row.tblUserGroup?.name,
    flex: 1,
  },
  {
    field: "Discipline",
    headerName: "Discipline",
    valueGetter: (_, row) => row?.tblEmployee?.tblDiscipline?.name,
    flex: 1,
  },
  {
    field: "forcePasswordChange",
    headerName: "Force Change Password",
    type: "boolean",
  },
  {
    field: "accountDisabled",
    headerName: "Account Disabled",
    type: "boolean",
  },
  {
    field: "lastLogin",
    headerName: "Last Login",
    renderCell: ({ value }) => <CellDateTime value={value} />,
    width: 140,
  },
];
