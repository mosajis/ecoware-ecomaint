import TabsComponent from "./ComponentUnitTabs";
import Splitter from "@/shared/components/Splitter";
import CustomizedTree from "@/shared/components/tree/CustomeTree";
import { useState, useCallback } from "react";
import { useDataTree } from "@/shared/hooks/useDataTree";
import {
  tblComponentUnit,
  TypeTblComponentUnit,
} from "@/core/api/generated/api";

export default function ComponentUnitTree() {
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");

  // === Mapper: تبدیل هر رکورد به ساختار درخت ===
  const mapper = useCallback((row: TypeTblComponentUnit) => {
    return {
      id: row.compId.toString(),
      label: `${row.compNo} (${row.tblCompType?.compTypeNo ?? "-"})`,
      parentId: row.locationId?.toString() ?? null,
      data: row, // کل رکورد جهت اکشن‌های ادیت/حذف
    };
  }, []);

  // === useDataTree ===
  const {
    rows,
    treeItems,
    loading,
    handleDelete,
    handleFormSuccess,
    handleRefresh,
  } = useDataTree(
    tblComponentUnit.getAll,
    tblComponentUnit.deleteById,
    "compId",
    mapper
  );

  // === Create / Edit handlers ===
  const handleCreate = () => {
    setSelectedRowId(null);
    setMode("create");
    setOpenForm(true);
  };

  const handleEdit = (row: TypeTblComponentUnit) => {
    setSelectedRowId(row.compId);
    setMode("update");
    setOpenForm(true);
  };

  return (
    <>
      <Splitter>
        <CustomizedTree
          label="Component Unit Tree"
          items={treeItems}
          loading={loading}
          onRefresh={handleRefresh}
          getRowId={(row) => row.compId}
          onAddClick={handleCreate}
          onEditClick={handleEdit}
          onDeleteClick={handleDelete}
        />

        <TabsComponent />
      </Splitter>

      {/* 
      <ComponentUnitFormDialog
        open={openForm}
        mode={mode}
        recordId={selectedRowId}
        onClose={() => setOpenForm(false)}
        onSuccess={(record) => {
          handleFormSuccess(record);
          setOpenForm(false);
        }}
      /> 
      */}
    </>
  );
}
