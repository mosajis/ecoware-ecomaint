import { TypeTblAddress } from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";

export const getRowId = (row: TypeTblAddress) => row.addressId;

export const columns: GridColDef<TypeTblAddress>[] = [
  { field: "code", headerName: "Code", width: 60 },
  { field: "name", headerName: "Name", flex: 1 },
  { field: "address1", headerName: "Address 1", flex: 1 },
  { field: "address2", headerName: "Address 2", flex: 1 },
  { field: "phone", headerName: "Phone", flex: 2 },
  { field: "contact", headerName: "Contact Person", flex: 1 },
  { field: "eMail", headerName: "Email", flex: 1 },
  { field: "orderNo", headerName: "Order No", width: 100 },
];
