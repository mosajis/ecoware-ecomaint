import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import StepResourceUsedUpsert from "./TabResourceUsedUpsert";
import { useState, useCallback } from "react";
import { useAtomValue } from "jotai";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { reportWorkAtom } from "../../ReportWorkAtom";
import { columns, getRowId } from "./TabResourceUsedColumns";
import {
  tblLogDiscipline,
  TypeTblLogDiscipline,
} from "@/core/api/generated/api";

const StepResourceUsed = () => {
  const initData = useAtomValue(reportWorkAtom);
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  const maintLogId = initData.maintLog?.maintLogId;

  // === Handlers ===
  const handleCreate = () => {
    if (!maintLogId) {
      return; // Should not happen due to disabled state
    }
    setSelectedRowId(null);
    setMode("create");
    setOpenForm(true);
  };

  const handleEdit = (row: TypeTblLogDiscipline) => {
    setSelectedRowId(row.logDiscId);
    setMode("update");
    setOpenForm(true);
  };

  const getAll = useCallback(() => {
    return tblLogDiscipline.getAll({
      filter: {
        maintLogId: maintLogId,
      },
      include: { tblDiscipline: true, tblEmployee: true },
    });
  }, [maintLogId]);

  const { rows, loading, handleRefresh, handleDelete } = useDataGrid(
    getAll,
    tblLogDiscipline.deleteById,
    "logDiscId",
    !!maintLogId,
  );

  const handleFormSuccess = () => {
    setOpenForm(false);
    handleRefresh();
  };
  return (
    <>
      <CustomizedDataGrid
        showToolbar
        disableEdit
        label="Resource Used"
        loading={loading}
        rows={rows}
        columns={columns}
        onDeleteClick={handleDelete}
        onRefreshClick={handleRefresh}
        onAddClick={handleCreate}
        getRowId={getRowId}
      />

      {/* === FORM === */}
      {maintLogId && (
        <StepResourceUsedUpsert
          open={openForm}
          mode={mode}
          recordId={selectedRowId}
          onClose={() => setOpenForm(false)}
          onSuccess={handleFormSuccess}
        />
      )}
    </>
  );
};

export default StepResourceUsed;
