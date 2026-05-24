import JobCounterUpsert from "./TabCounterUpsert";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useCallback, useState } from "react";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { tblCompJobCounter, TypeTblCompJob } from "@/core/api/generated/api";
import { columns, getRowId } from "./TabCounterColumns";

type Props = {
  compJob?: TypeTblCompJob | null;
};

const TabCounter = ({ compJob }: Props) => {
  const compJobId = compJob?.compJobId;
  const compId = compJob?.compId;

  const label = compJob?.tblJobDescription?.jobDescTitle || "";

  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // === getAll ===
  const getAll = useCallback(() => {
    return tblCompJobCounter.getAll({
      include: {
        tblCompCounter: {
          include: {
            tblCounterType: true,
          },
        },
      },
      filter: {
        compJobId,
      },
    });
  }, [compJobId]);

  // === useDataGrid ===
  const { rows, loading, handleDelete, handleRefresh } = useDataGrid(
    getAll,
    tblCompJobCounter.deleteById,
    "compJobId",
    !!compJobId,
  );

  // === Handlers ===
  const handleCreate = () => {
    setSelectedId(null);
    setMode("create");
    handleUpsertOpen();
  };

  const handleEdit = (rowId: number) => {
    setSelectedId(rowId);
    setMode("update");
    handleUpsertOpen();
  };

  const handleUpsertClose = useCallback(() => {
    setOpenForm(false);
  }, []);

  const handleUpsertOpen = useCallback(() => {
    setOpenForm(true);
  }, []);

  return (
    <>
      <CustomizedDataGrid
        label={label}
        rows={rows}
        columns={columns}
        loading={loading}
        showToolbar={!!label}
        onRefreshClick={handleRefresh}
        onAddClick={handleCreate}
        onEditClick={handleEdit}
        onDoubleClick={handleEdit}
        onDeleteClick={handleDelete}
        getRowId={getRowId}
      />

      {/* === UPSERT === */}
      {compJobId && compId && (
        <JobCounterUpsert
          open={openForm}
          mode={mode}
          recordId={selectedId}
          compJobId={compJobId}
          compId={compId}
          onClose={handleUpsertClose}
          onSuccess={handleRefresh}
        />
      )}
    </>
  );
};

export default TabCounter;
