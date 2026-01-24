import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import ReportWorkStep from "../../ReportWorkStep";
import StepStockUsedUpsert from "./StepStockUsedUpsert";
import { useCallback, useState } from "react";
import {
  tblMaintLogStocks,
  TypeTblMaintLogStocks,
} from "@/core/api/generated/api";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { GridColDef } from "@mui/x-data-grid";
import { useAtomValue } from "jotai";
import { atomInitalData } from "../../ReportWorkAtom";
import { dataGridActionColumn } from "@/shared/components/dataGrid/DataGridActionsColumn";

const StepStockUsed = () => {
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  const { maintLog } = useAtomValue(atomInitalData);

  const maintLogId = maintLog?.maintLogId;

  const handleCreate = () => {
    setSelectedRowId(null);
    setMode("create");
    setOpenForm(true);
  };

  const handleEdit = (row: TypeTblMaintLogStocks) => {
    setSelectedRowId(row.maintLogStockId);
    setMode("update");
    setOpenForm(true);
  };

  const getAll = useCallback(() => {
    return tblMaintLogStocks.getAll({
      include: {
        tblStockItem: {
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
    tblMaintLogStocks.deleteById,
    "maintLogStockId",
    !!maintLogId,
  );

  const columns: GridColDef<TypeTblMaintLogStocks>[] = [
    {
      field: "stockNo",
      headerName: "Extra No",
      width: 100,
      // @ts-ignore
      valueGetter: (_, row) => row.tblStockItem.tblSpareType.no,
    },
    {
      field: "stockName",
      headerName: "Stock Name",
      flex: 1,
      // @ts-ignore
      valueGetter: (_, row) => row.tblStockItem.tblSpareType.name,
    },
    dataGridActionColumn({ onEdit: handleEdit, onDelete: handleDelete }),
  ];

  const handleNext = (goNext: () => void) => {
    goNext();
  };

  return (
    <>
      <ReportWorkStep onNext={handleNext}>
        <CustomizedDataGrid
          showToolbar
          loading={loading}
          label={"Stock Used"}
          onAddClick={handleCreate}
          rows={rows}
          getRowId={(row) => row.maintLogStockId}
          columns={columns}
        />
      </ReportWorkStep>

      <StepStockUsedUpsert
        open={openForm}
        mode={mode}
        recordId={selectedRowId}
        maintLogId={maintLogId || undefined}
        onClose={() => setOpenForm(false)}
        onSuccess={handleRefresh}
      />
    </>
  );
};

export default StepStockUsed;
