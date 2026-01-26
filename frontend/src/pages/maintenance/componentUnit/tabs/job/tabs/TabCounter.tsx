import JobCounterUpsert from "./TabCounterUpsert";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useCallback, useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import {
  tblCompJobCounter,
  tblCompTypeJobCounter,
  TypeTblCompJob,
  TypeTblCompJobCounter,
  TypeTblCompTypeJobCounter,
} from "@/core/api/generated/api";

type Props = {
  compJob?: TypeTblCompJob | null;
};

const getRowId = (row: TypeTblCompJobCounter) => row.compJobCounterId;

// === Columns ===
const columns: GridColDef<TypeTblCompTypeJobCounter>[] = [
  {
    field: "counterType",
    headerName: "Counter Type",
    flex: 1,
    valueGetter: (_, row) =>
      // @ts-ignore
      row.tblCompCounter?.tblCounterType?.name,
  },
  { field: "frequency", headerName: "Frequency", width: 120 },
  { field: "window", headerName: "Window", width: 120 },
  {
    field: "showInAlert",
    headerName: "Alert",
    width: 90,
    type: "boolean",
  },
  {
    field: "updateByFunction",
    headerName: "By Func",
    width: 110,
    type: "boolean",
  },
  { field: "orderNo", headerName: "Order No", width: 80 },
];

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
    tblCompTypeJobCounter.deleteById,
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
