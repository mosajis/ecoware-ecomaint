import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import TabSpareUsedUpsert from "./TabSpareUsedUpsert";
import { useCallback, useState } from "react";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { tblMaintLogSpare, TypeTblMaintLog } from "@/core/api/generated/api";
import { columns, getRowId } from "./TabSpareUsedColumns";

type Props = {
  selected: TypeTblMaintLog;
};

const TabSpareUsed = ({ selected }: Props) => {
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  const maintLogId = selected?.maintLogId;

  const handleCreate = () => {
    setSelectedRowId(null);
    setMode("create");
    handleUpsertOpen();
  };

  const getAll = useCallback(() => {
    return tblMaintLogSpare.getAll({
      include: {
        tblSpareUnit: {
          include: {
            tblSpareType: true,
          },
        },
      },
      filter: {
        maintLogId: maintLogId,
      },
    });
  }, [maintLogId]);

  // === useDataGrid ===
  const { rows, loading, handleDelete, handleRefresh } = useDataGrid(
    getAll,
    tblMaintLogSpare.deleteById,
    "maintLogSpareId",
    !!maintLogId,
  );

  const handleUpsertClose = useCallback(() => {
    setOpenForm(false);
  }, []);

  const handleUpsertOpen = useCallback(() => {
    setOpenForm(true);
  }, []);
  return (
    <>
      <CustomizedDataGrid
        showToolbar={!!maintLogId}
        disableEdit
        onDeleteClick={handleDelete}
        label={"Stock Used"}
        onAddClick={handleCreate}
        getRowId={getRowId}
        loading={loading}
        rows={rows}
        columns={columns}
      />

      <TabSpareUsedUpsert
        open={openForm}
        mode={mode}
        recordId={selectedRowId}
        maintLogId={maintLogId}
        onClose={handleUpsertClose}
        onSuccess={handleRefresh}
      />
    </>
  );
};

export default TabSpareUsed;
