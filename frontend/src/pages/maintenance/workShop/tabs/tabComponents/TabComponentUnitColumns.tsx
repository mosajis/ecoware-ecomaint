import { TypeTblWorkShopComponent } from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";

export const getRowId = (row: TypeTblWorkShopComponent) => row.workShopCompId;

export const columns: GridColDef<TypeTblWorkShopComponent>[] = [
  {
    field: "compNo",
    headerName: "Component No",
    width: 280,
    valueGetter: (_, row) => row?.tblComponentUnit?.compNo ?? "",
  },
  {
    field: "compType",
    headerName: "Component Type",
    flex: 1,
    // @ts-ignore
    valueGetter: (_, row) => row?.tblComponentUnit?.tblCompType?.compName ?? "",
  },
  {
    field: "model",
    headerName: "Model / Type",
    flex: 1,
    valueGetter: (_, row) => row?.tblComponentUnit?.model ?? "",
  },
  {
    field: "locationId",
    headerName: "Location",
    flex: 1,

    valueGetter: (_, row) => row?.tblLocation?.name ?? "",
  },
  {
    field: "serialNo",
    headerName: "Serial No",
    flex: 1,
    valueGetter: (_, row) => row?.tblComponentUnit?.serialNo ?? "",
  },
];
