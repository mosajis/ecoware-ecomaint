import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";
import CellFullName from "@/shared/components/dataGrid/cells/CellFullName";
import { GridColDef } from "@mui/x-data-grid";
import { TypeTblWorkShopComponent } from "@/core/api/generated/api";

export const getRowId = (row: TypeTblWorkShopComponent) => row.workShopCompId;

export const columns: GridColDef<TypeTblWorkShopComponent>[] = [
  {
    field: "workShopId",
    headerName: "No",
    width: 60,
  },
  {
    field: "title",
    headerName: "Title",
    flex: 1,
    valueGetter: (_, row) => row?.tblWorkShop?.title,
  },
  {
    field: "awardingDate",
    headerName: "Awarding Date",
    flex: 1,
    valueGetter: (_, row) => row?.tblWorkShop?.awardingDate,
    renderCell: ({ value }) => <CellDateTime value={value} type="DATETIME" />,
  },
  {
    field: "createdDate",
    headerName: "Created Date",
    flex: 1,
    renderCell: ({ value }) => <CellDateTime value={value} type="DATETIME" />,
  },
  {
    field: "discipline",
    headerName: "Discipline",
    flex: 1,
    // @ts-ignore
    valueGetter: (_, row) => row?.tblDiscipline?.name,
  },
  {
    field: "personInCharge",
    headerName: "Person In Charge",
    flex: 1,
    valueGetter: (_, row) =>
      row?.tblWorkShop?.tblUsersTblWorkShopPersonInChargeIdTotblUsers,
    renderCell: ({ value }) => <CellFullName value={value} />,
  },
  {
    field: "personInChargeApprove",
    headerName: "ToolPusher",
    flex: 1,
    valueGetter: (_, row) =>
      row?.tblWorkShop?.tblUsersTblWorkShopPersonInChargeApproveIdTotblUsers,

    renderCell: ({ value }) => <CellFullName value={value} />,
  },
  {
    field: "closedDate",
    headerName: "Closed Date",
    flex: 1,
    renderCell: ({ value }) => <CellDateTime value={value} type="DATE" />,
  },
  {
    field: "closedBy",
    headerName: "Closed By",
    flex: 1,
    valueGetter: (_, row) =>
      row?.tblWorkShop?.tblUsersTblWorkShopClosedByIdTotblUsers,
    renderCell: ({ value }) => <CellFullName value={value} />,
  },
];
