import Upsert from "./TabTriggerUpsert";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useCallback, useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import {
  tblCompJobTrigger,
  TypeTblCompJob,
  TypeTblCompJobTrigger,
} from "@/core/api/generated/api";

type Props = {
  compJob?: TypeTblCompJob | null;
};

const getRowId = (row: TypeTblCompJobTrigger) => row.compJobTriggerId;

// === Columns ===
const columns: GridColDef<TypeTblCompJobTrigger>[] = [
  {
    field: "Trigger",
    headerName: "Trigger",
    flex: 1,
    valueGetter: (_, row) => row.tblJobTrigger?.descr,
  },
  { field: "orderNo", headerName: "Order No", width: 80 },
];

const TabJobTrigger = ({ compJob }: Props) => {
  const compJobId = compJob?.compJobId;
  const compId = compJob?.compId;

  const label = compJob?.tblJobDescription?.jobDescTitle || "";

  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // === getAll ===
  const getAll = useCallback(() => {
    return tblCompJobTrigger.getAll({
      include: {
        tblJobTrigger: true,
      },
      filter: {
        compJobId,
      },
    });
  }, [compJobId]);

  // === useDataGrid ===
  const { rows, loading, handleDelete, handleRefresh } = useDataGrid(
    getAll,
    tblCompJobTrigger.deleteById,
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
        disableEdit
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
        <Upsert
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

export default TabJobTrigger;
