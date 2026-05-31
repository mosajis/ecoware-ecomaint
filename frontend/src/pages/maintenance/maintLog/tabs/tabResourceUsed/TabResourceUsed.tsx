import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { useState, useCallback } from "react";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { columns, getRowId } from "./TabResourceUsedColumns";
import {
  tblLogDiscipline,
  TypeTblLogDiscipline,
  TypeTblMaintLog,
} from "@/core/api/generated/api";
import TabResourceUsedUpsert from "./TabResourceUsedUpsert";

type Props = {
  selected: TypeTblMaintLog;
};

const TabResourceUsed = ({ selected }: Props) => {
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  const maintLogId = selected?.maintLogId;

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
      {rows.length <= 0 && selected?.maintLogId && (
        <Alert severity="warning" sx={{ mb: 0.5 }}>
          No resources found for this Maintenance Log. Please add at least one
          record.
        </Alert>
      )}
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
        <TabResourceUsedUpsert
          maintLogId={maintLogId}
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

export default TabResourceUsed;
