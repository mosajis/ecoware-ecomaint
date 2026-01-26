import Splitter from "@/shared/components/Splitter/Splitter";
import TabsComponent from "./FunctionTabs";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import FunctionUpsert from "./FunctionUpsert";
import { tblFunctions, TypeTblFunctions } from "@/core/api/generated/api";
import { useCallback, useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";

const getRowId = (row: TypeTblFunctions) => row.functionId;

// === Columns ===
const columns: GridColDef<TypeTblFunctions>[] = [
  { field: "funcNo", headerName: "Function No", flex: 1 },
  { field: "funcDescr", headerName: "Function Descr", flex: 1 },
  { field: "funcRef", headerName: "Function Ref", flex: 1 },
  {
    field: "component",
    headerName: "Component",
    flex: 1,
    valueGetter: (_, row) => row.tblComponentUnit?.compNo,
  },
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

  return (
    <>
      <Splitter horizontal>
        <CustomizedDataGrid
          showToolbar
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
        <TabsComponent label={row?.funcDescr} functionId={selectedRowId} />
      </Splitter>
      <FunctionUpsert
        open={openForm}
        mode={mode}
        recordId={selectedRowId}
        onClose={handleUpsertClose}
        onSuccess={handleRefresh}
      />
    </>
  );
}
