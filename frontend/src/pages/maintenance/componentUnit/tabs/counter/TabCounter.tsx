import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import TabCounterUpsert from "./TabCounterUpsert";
import { useCallback, useState } from "react";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { tblCompCounter, TypeTblComponentUnit } from "@/core/api/generated/api";
import { columns, getRowId } from "./TabCounterColumns";

type Props = {
  componentUnit?: TypeTblComponentUnit | null;
  label?: string;
};

const TabCompCounter = ({ componentUnit, label }: Props) => {
  const compId = componentUnit?.compId;
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // === getAll ===
  const getAll = useCallback(() => {
    return tblCompCounter.getAll({
      include: {
        tblCounterType: true,
        tblCompJobCounters: true,
      },
      filter: {
        compId,
      },
    });
  }, [compId]);

  // === useDataGrid ===
  const { rows, loading, handleDelete, handleRefresh } = useDataGrid(
    getAll,
    tblCompCounter.deleteById,
    "compCounterId",
    !!compId,
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
        showToolbar={!!label}
        columns={columns}
        rows={rows}
        loading={loading}
        onRefreshClick={handleRefresh}
        onAddClick={handleCreate}
        onDoubleClick={handleEdit}
        onEditClick={handleEdit}
        onDeleteClick={handleDelete}
        getRowId={getRowId}
      />

      <TabCounterUpsert
        open={openForm}
        mode={mode}
        recordId={selectedId}
        compId={compId!}
        onClose={handleUpsertClose}
        onSuccess={handleRefresh}
      />
    </>
  );
};

export default TabCompCounter;
