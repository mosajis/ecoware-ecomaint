import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import StepResourceUsedUpsert from "./TabResourceUsedUpsert";
import { useState, useCallback } from "react";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { columns, getRowId } from "./TabResourceUsedColumns";
import {
  tblLogDiscipline,
  TypeTblFailureReport,
} from "@/core/api/generated/api";

type Props = {
  failreReport?: TypeTblFailureReport;
};

const StepResourceUsed = ({ failreReport }: Props) => {
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  const maintLogId = failreReport?.maintLogId;

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
        disableEdit
        showToolbar={!!maintLogId}
        label={failreReport?.title || "Resource Used"}
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
          maintLogId={maintLogId}
          open={openForm}
          mode={mode}
          recordId={maintLogId}
          onClose={() => setOpenForm(false)}
          onSuccess={handleFormSuccess}
        />
      )}
    </>
  );
};

export default StepResourceUsed;
