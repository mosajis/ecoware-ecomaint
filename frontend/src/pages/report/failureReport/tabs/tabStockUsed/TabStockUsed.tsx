// StepStockUsed.tsx
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
import { atomInitData } from "../../FailureReportAtom";

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
  {
    field: "stockCount",
    headerName: "Count",
    flex: 1,
  },
  {
    field: "unit",
    headerName: "Unit",
    flex: 1,
    // @ts-ignore
    valueGetter: (_, row) => row?.tblSpareUnit?.tblSpareType?.tblUnit?.name,
  },
];

const TabStockUsed = () => {
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  const { maintLog } = useAtomValue(atomInitData);
  const maintLogId = maintLog?.maintLogId;

  const handleCreate = () => {
    setSelectedRowId(null);
    setMode("create");
    setOpenForm(true);
  };

  const getAll = useCallback(() => {
    return tblMaintLogSpare.getAll({
      include: {
        tblSpareUnit: {
          include: {
            tblSpareType: {
              include: {
                tblUnit: true,
              },
            },
          },
        },
      },
      filter: {
        maintLogId: maintLogId,
      },
    });
  }, [maintLogId]);

  const { rows, loading, handleDelete, handleRefresh } = useDataGrid(
    getAll,
    tblMaintLogSpare.deleteById,
    "maintLogSpareId",
    !!maintLogId,
  );

  return (
    <>
      <CustomizedDataGrid
        showToolbar
        disableEdit
        onDeleteClick={handleDelete}
        label="Stock Used"
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
        onClose={() => setOpenForm(false)}
        onSuccess={handleRefresh}
      />
    </>
  );
};

export default TabStockUsed;
