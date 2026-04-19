import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import StepResourceUsedUpsert from "./TabResourceUsedUpsert";
import { useState, useCallback } from "react";
import { useAtomValue } from "jotai";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { atomInitData } from "../../FailureReportAtom";
import { columns, getRowId } from "./TabResourceUsedColumns";
import { tblLogDiscipline } from "@/core/api/generated/api";

const StepResourceUsed = () => {
  const { maintLog } = useAtomValue(atomInitData);
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  const maintLogId = maintLog?.maintLogId;

  const handleCreate = () => {
    if (!maintLogId) return;
    setSelectedRowId(null);
    setMode("create");
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
