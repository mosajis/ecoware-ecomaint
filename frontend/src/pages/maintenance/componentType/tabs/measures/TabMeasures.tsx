import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import MeasurePointUpsert from "./TabMeasuresUpsert";
import ConfirmDialog from "@/shared/components/ConfirmDialog";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import { useCallback, useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { toast } from "sonner";
import { logicTblCompTypeMeasurePoint } from "@/core/api/api";
import {
  tblCompTypeMeasurePoint,
  TypeTblCompType,
  TypeTblCompTypeMeasurePoint,
} from "@/core/api/generated/api";

type Props = {
  compType?: TypeTblCompType | null;
  label?: string;
};

const getRowId = (row: TypeTblCompTypeMeasurePoint) =>
  row.compTypeMeasurePointId;

// === Columns ===
const columns: GridColDef<TypeTblCompTypeMeasurePoint>[] = [
  {
    field: "measureName",
    headerName: "Measure",
    flex: 1,
    valueGetter: (_, row) => row.tblCounterType?.name,
  },
  {
    field: "unitName",
    headerName: "Unit",
    flex: 1,
    valueGetter: (_, row) => row.tblUnit?.name,
  },
  {
    field: "unitDescription",
    headerName: "Unit Description",
    flex: 1,
    valueGetter: (_, row) => row.tblUnit?.description,
  },
  { field: "setValue", headerName: "Set Value", width: 110 },
  { field: "operationalMinValue", headerName: "Min", width: 100 },
  { field: "operationalMaxValue", headerName: "Max", width: 100 },
  { field: "orderNo", headerName: "Order", width: 80 },
];

const TabMeasuresPage = ({ compType, label }: Props) => {
  const compTypeId = compType?.compTypeId;

  // ---- UI State
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedRow, setSelectedRow] =
    useState<TypeTblCompTypeMeasurePoint | null>(null); // 👈 اضافه شد

  // ---- Effect / Delete State
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteRow, setPendingDeleteRow] =
    useState<TypeTblCompTypeMeasurePoint | null>(null);
  const [effectId, setEffectId] = useState<number | null>(null);
  const [effectOperation, setEffectOperation] = useState<0 | 1 | 2 | null>(
    null,
  );
  const [oldCounterTypeId, setOldCounterTypeId] = useState<number | null>(null);

  // ================= Data =================
  const getAll = useCallback(() => {
    return tblCompTypeMeasurePoint.getAll({
      filter: { compTypeId },
      include: { tblUnit: true, tblCounterType: true },
    });
  }, [compTypeId]);

  const { rows, loading, handleRefresh } = useDataGrid(
    getAll,
    undefined as any,
    "compTypeMeasurePointId",
    !!compTypeId,
  );

  // ================= Handlers =================
  const handleCreate = () => {
    setSelectedId(null);
    setSelectedRow(null); // 👈 اضافه شد
    setMode("create");
    setOpenForm(true);
  };

  const handleEdit = (rowId: number) => {
    const row = rows.find((r) => r.compTypeMeasurePointId === rowId); // 👈 اضافه شد
    setSelectedId(rowId);
    setSelectedRow(row || null); // 👈 اضافه شد
    setMode("update");
    setOpenForm(true);
  };

  const handleRowClick = ({ row }: { row: TypeTblCompTypeMeasurePoint }) => {
    setSelectedId(row.compTypeMeasurePointId);
    setSelectedRow(row); // 👈 اضافه شد
  };

  const handleAskDelete = (rowId: number) => {
    const row = rows.find((r) => r.compTypeMeasurePointId === rowId);
    if (!row) return;

    setPendingDeleteRow(row);
    setEffectId(row.compTypeMeasurePointId);
    setEffectOperation(2);
    setConfirmOpen(true);
  };

  const handleUpsertSuccess = (data: TypeTblCompTypeMeasurePoint) => {
    setEffectId(data.compTypeMeasurePointId);
    setEffectOperation(mode === "create" ? 0 : 1);

    setOldCounterTypeId(selectedRow?.counterTypeId || null);

    setConfirmOpen(true);
  };

  const resetConfirmState = () => {
    setConfirmOpen(false);
    setPendingDeleteRow(null);
    setEffectId(null);
    setEffectOperation(null);
    setOldCounterTypeId(null);
  };

  const handleConfirmYes = async () => {
    try {
      if (effectId !== null && effectOperation !== null) {
        await logicTblCompTypeMeasurePoint.effect(
          effectId,
          effectOperation,
          oldCounterTypeId || undefined, // 👈 اصلاح شد
        );
      }

      if (effectOperation === 2 && pendingDeleteRow) {
        await tblCompTypeMeasurePoint.deleteById(
          pendingDeleteRow.compTypeMeasurePointId,
        );
      }

      toast.success("Changes applied successfully");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to apply effect");
    } finally {
      resetConfirmState();
      handleRefresh();
    }
  };

  const handleConfirmNo = async () => {
    if (effectOperation === 2 && pendingDeleteRow) {
      await tblCompTypeMeasurePoint.deleteById(
        pendingDeleteRow.compTypeMeasurePointId,
      );
    }
    resetConfirmState();
    handleRefresh();
  };

  // ================= Render =================
  return (
    <>
      <CustomizedDataGrid
        showToolbar={!!label}
        label={label}
        rows={rows}
        columns={columns}
        loading={loading}
        getRowId={getRowId}
        onRefreshClick={handleRefresh}
        onAddClick={handleCreate}
        onEditClick={handleEdit}
        onDeleteClick={handleAskDelete}
        onDoubleClick={handleEdit}
      />

      <MeasurePointUpsert
        open={openForm}
        mode={mode}
        recordId={selectedId}
        compTypeId={compTypeId!}
        onClose={() => setOpenForm(false)}
        onSuccess={handleUpsertSuccess}
      />

      <ConfirmDialog
        open={confirmOpen}
        icon={<PublishedWithChangesIcon sx={{ fontSize: "3rem" }} />}
        title="Apply Changes"
        message="Apply changes to related components?"
        confirmText="Yes"
        cancelText="No"
        confirmColor="primary"
        onConfirm={handleConfirmYes}
        onCancel={handleConfirmNo}
      />
    </>
  );
};

export default TabMeasuresPage;
