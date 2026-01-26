import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import TabCounterUpsert from "./TabCounterUpsert";
import { useCallback, useMemo, useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { dataGridActionColumn } from "@/shared/components/dataGrid/DataGridActionsColumn";
import {
  tblCompCounter,
  TypeTblComponentUnit,
  TypeTblCompCounter,
} from "@/core/api/generated/api";

type Props = {
  componentUnit?: TypeTblComponentUnit | null;
  label?: string;
};

const getRowId = (row: TypeTblCompCounter) => row.compCounterId;

// === Columns ===
const columns: GridColDef<TypeTblCompCounter>[] = [
  {
    field: "counterType",
    headerName: "Counter Type",
    flex: 1,
    valueGetter: (_, row) => row.tblCounterType?.name || "",
  },
  {
    field: "currentValue",
    headerName: "Current Value",
    width: 120,
  },
  {
    field: "startValue",
    headerName: "Start Value",
    width: 120,
  },
  {
    field: "averageCountRate",
    headerName: "Avg Rate",
    width: 120,
  },
  {
    field: "order No",
    headerName: "Order",
    width: 85,
  },
];

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
        tblCompCounterLogs: true,
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
