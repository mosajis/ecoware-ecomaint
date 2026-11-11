import { TypeTblCompOilInfo } from "@/core/api/generated/api";
import { extractFullName } from "@/core/helper";
import { GridColDef } from "@mui/x-data-grid";

export const getRowId = (row: TypeTblCompOilInfo) => row.compOilInfoId;

export const columns: GridColDef<TypeTblCompOilInfo>[] = [
  {
    field: "tankCapacity",
    headerName: "Tank Capacity",
    width: 130,
  },
  {
    field: "laboratoryCode",
    headerName: "Laboratory Code",
    width: 160,
  },
  {
    field: "samplingPosition",
    headerName: "Sampling Position",
    flex: 1,
  },
  {
    field: "oilDesc",
    headerName: "Oil Description",
    flex: 1,
  },
  {
    field: "employeeId",
    headerName: "Employee",
    flex: 1,
    valueGetter: (_, row) => extractFullName(row.tblEmployee),
  },
  {
    field: "orderNo",
    headerName: "Order No",
    width: 100,
  },
];
