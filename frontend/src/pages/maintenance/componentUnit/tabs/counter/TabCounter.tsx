import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import TabCounterUpsert from "./TabCounterUpsert";
import { useCallback, useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import {
  tblCompCounter,
  TypeTblComponentUnit,
  TypeTblCompCounter,
} from "@/core/api/generated/api";
import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";

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
    field: "currentDate",
    headerName: "Current Date",
    flex: 1,

    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
  {
    field: "currentValue",
    headerName: "Current Value",
    flex: 1,
  },
  {
    field: "startDate",
    headerName: "Start Date",
    flex: 1,

    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
  {
    field: "startValue",
    headerName: "Start Value",
    flex: 1,
  },
  {
    field: "useCalcAverage",
    headerName: "Use Calc Avg",
    flex: 1,
    type: "boolean",
  },
  {
    field: "averageCountRate",
    headerName: "Avg Rate",
    flex: 1,
  },
  {
    field: "orderNo",
    headerName: "Order No",
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
