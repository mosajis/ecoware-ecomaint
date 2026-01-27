import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Splitter from "@/shared/components/Splitter/Splitter";
import TabsComponent from "./FunctionTabs";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import FunctionUpsert from "./FunctionUpsert";
import DialogInstallRemoveComponent from "./DialogInstallRemoveComponent";
import Add from "@mui/icons-material/Add";
import Remove from "@mui/icons-material/Remove";
import { tblFunctions, TypeTblFunctions } from "@/core/api/generated/api";
import { useCallback, useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";

const getRowId = (row: TypeTblFunctions) => row.functionId;

// === Columns ===
const columns: GridColDef<TypeTblFunctions>[] = [
  { field: "funcNo", headerName: "Function No", flex: 1 },
  { field: "funcDesc", headerName: "Function Desc", flex: 1 },
  {
    field: "component",
    headerName: "Component",
    flex: 1,
    valueGetter: (_, row) => row.tblComponentUnit?.compNo,
  },
  { field: "orderNo", headerName: "Order No", width: 120 },
];

// دو تا دکمه install Component و remove COmponent
// وقتی install کام رو زد یک مودال باز میشه یک نوت میگیره
// یک تاریخ میگیره
// یه کامپوونت
// توضیحات میگیره
// میزنه توی rotationLog insert
// تو خود function به روزنه رسانی کامپوونت
// تمامی tab ها از روی Component

// در جدول componentUnit استوس باید به روز رسانی شود به 2 inUsed

// لیست component هایی که تو مودال نشون میدیم فقط None ها 1

// وقتی که ریمو میکنیم وضعین کامپ.ننت میشه none
// وقتی که remove هم میکنیم to Date
// توضیحات هم میخواد
// فانکشن هم به روزاسانی کامپوننت

export default function PageFunction() {
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [row, setRow] = useState<TypeTblFunctions | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");

  const [componentDialog, setComponentDialog] = useState<{
    open: boolean;
    mode: "install" | "remove";
  } | null>(null);

  const getAll = useCallback(
    () =>
      tblFunctions.getAll({
        include: {
          tblComponentUnit: true,
        },
      }),
    [],
  );
  // === useDataGrid ===
  const { rows, loading, handleRefresh, handleDelete } = useDataGrid(
    getAll,
    tblFunctions.deleteById,
    "functionId",
  );

  const handleRowClick = (params: any) => {
    setRow(params.row);
  };

  // === Handlers ===
  const handleCreate = useCallback(() => {
    setSelectedRowId(null);
    setMode("create");
    handleUpsertOpen();
  }, []);

  const handleEdit = useCallback((rowId: number) => {
    setSelectedRowId(rowId);
    setMode("update");
    handleUpsertOpen();
  }, []);

  const handleUpsertClose = useCallback(() => {
    setOpenForm(false);
  }, []);

  const handleUpsertOpen = useCallback(() => {
    setOpenForm(true);
  }, []);

  const Toolbar = () => (
    <Box display={"flex"}>
      <Button
        disabled={!row || !!row.compId}
        size="small"
        startIcon={<Add />}
        onClick={() => setComponentDialog({ open: true, mode: "install" })}
      >
        Install Component
      </Button>

      <Button
        color="error"
        size="small"
        startIcon={<Remove />}
        disabled={!row || !row.compId}
        onClick={() => setComponentDialog({ open: true, mode: "remove" })}
      >
        Remove Component
      </Button>
    </Box>
  );
  return (
    <>
      <Splitter horizontal>
        <CustomizedDataGrid
          showToolbar
          toolbarChildren={<Toolbar />}
          label="Functions"
          rows={rows}
          columns={columns}
          loading={loading}
          onEditClick={handleEdit}
          onDeleteClick={handleDelete}
          onDoubleClick={handleEdit}
          onAddClick={handleCreate}
          onRefreshClick={handleRefresh}
          getRowId={getRowId}
          onRowClick={handleRowClick}
        />
        <TabsComponent label={row?.funcDesc} functionId={selectedRowId} />
      </Splitter>
      <FunctionUpsert
        open={openForm}
        mode={mode}
        recordId={selectedRowId}
        onClose={handleUpsertClose}
        onSuccess={handleRefresh}
      />
      {componentDialog && row && (
        <DialogInstallRemoveComponent
          open={componentDialog.open}
          mode={componentDialog.mode}
          functionId={row.functionId}
          compId={row.compId}
          onClose={() => setComponentDialog(null)}
          onSuccess={handleRefresh}
        />
      )}
    </>
  );
}
