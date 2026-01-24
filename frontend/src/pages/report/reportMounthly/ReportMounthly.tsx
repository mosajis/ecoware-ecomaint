import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { GridColDef } from "@mui/x-data-grid";
import { useCallback, useState } from "react";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { tblSpareType, TypeTblSpareType } from "@/core/api/generated/api";

const getRowId = (row: TypeTblSpareType) => row.spareTypeId;
// === Columns ===
const columns: GridColDef<TypeTblSpareType>[] = [
  { field: "partName", headerName: "Number", width: 120 },
  { field: "makerRef", headerName: "Comp No", flex: 2 },
  {
    field: "MESC",
    headerName: "Failure Date",
    flex: 1,
    // @ts-ignore
    valueGetter: (value, row) => row?.tblJobClass?.name,
  },
  { field: "extraNo", headerName: "Title", flex: 1 },
  { field: "changeReason", headerName: "Total Wait", flex: 1 },
  { field: "notes", headerName: "Disc. Name", flex: 1 },
  { field: "description", headerName: "Last Updated", flex: 1 },
  { field: "farsiDescription", headerName: "Loged By", flex: 1 },
  { field: "farsiDescription", headerName: "Approved By", flex: 1 },
  { field: "farsiDescription", headerName: "Closed By", flex: 1 },
  { field: "farsiDescription", headerName: "Closed Date", flex: 1 },
];

export default function PageReportMounthly() {
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [selected, setSelected] = useState<TypeTblSpareType | null>(null);

  const { rows, loading, handleRefresh, handleDelete } = useDataGrid(
    tblSpareType.getAll,
    tblSpareType.deleteById,
    "spareTypeId",
    false,
  );

  // === Handlers ===
  const handleCreate = useCallback(() => {
    setSelected(null);
    setMode("create");
    setOpenForm(true);
  }, []);

  const handleEdit = useCallback((row: any) => {
    setSelected(row);
    setMode("update");
    setOpenForm(true);
  }, []);

  return (
    <CustomizedDataGrid
      label="Failure Report"
      getRowId={getRowId}
      loading={loading}
      onAddClick={handleCreate}
      rows={rows}
      onRefreshClick={handleRefresh}
      columns={columns}
      showToolbar
    />
  );
}
