import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import StepStockUsedUpsert from "./TabStockUsedUpsert";
import { useCallback, useState } from "react";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { GridColDef } from "@mui/x-data-grid";
import { useAtomValue } from "jotai";
import {
  tblMaintLogSpare,
  TypeTblMaintLogSpare,
} from "@/core/api/generated/api";
import { reportWorkAtom } from "../../ReportWorkAtom";

const getRowId = (row: TypeTblMaintLogSpare) => row.maintLogSpareId;

const columns: GridColDef<TypeTblMaintLogSpare>[] = [
  {
    field: "partName",
    headerName: "Part Name",
    flex: 1,
    // @ts-ignore
    valueGetter: (_, row) => row?.tblSpareUnit?.tblSpareType.name,
  },
  {
    field: "partTypeNo",
    headerName: "MESC Code",
    flex: 1,
    // @ts-ignore
    valueGetter: (_, row) => row?.tblSpareUnit.tblSpareType.partTypeNo,
  },
  {
    field: "makerRefNo",
    headerName: "Maker Ref",
    flex: 1,
    // @ts-ignore
    valueGetter: (_, row) => row?.tblSpareUnit.tblSpareType.makerRefNo,
  },
];

const StepStockUsed = () => {
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  const { maintLog } = useAtomValue(reportWorkAtom);

  const maintLogId = maintLog?.maintLogId;

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
        showToolbar
        disableEdit
        onDeleteClick={handleDelete}
        label={"Stock Used"}
        onAddClick={handleCreate}
        getRowId={getRowId}
        loading={loading}
        rows={rows}
        columns={columns}
      />

      <StepStockUsedUpsert
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

export default StepStockUsed;
