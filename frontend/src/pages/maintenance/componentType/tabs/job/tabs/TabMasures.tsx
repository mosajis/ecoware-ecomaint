import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import JobMeasureUpsert from "./TabMasuresUpsert";
import ConfirmDialog from "@/shared/components/ConfirmDialog";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import { useCallback, useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { toast } from "sonner";
import { logicTblCompTypeJobMeasurePoint } from "@/core/api/api";
import {
  tblCompTypeJobMeasurePoint,
  TypeTblCompTypeJob,
  TypeTblCompTypeJobMeasurePoint,
} from "@/core/api/generated/api";

type Props = {
  compTypeJob?: TypeTblCompTypeJob;
};

const getRowId = (row: TypeTblCompTypeJobMeasurePoint) =>
  row.compTypeJobMeasurePointId;

/* ================= Columns ================= */

const columns: GridColDef<TypeTblCompTypeJobMeasurePoint>[] = [
  {
    field: "measureName",
    headerName: "Measure Name",
    flex: 1,
    valueGetter: (_, row) =>
      //@ts-ignore
      row?.tblCompTypeMeasurePoint?.tblCounterType?.name || "",
  },
  {
    field: "unitName",
    headerName: "Unit Name",
    flex: 1,
    valueGetter: (_, row) =>
      //@ts-ignore
      row?.tblCompTypeMeasurePoint?.tblUnit?.name || "",
  },
  {
    field: "unitDescription",
    headerName: "Unit Description",
    flex: 1,
    valueGetter: (_, row) =>
      //@ts-ignore
      row?.tblCompTypeMeasurePoint?.tblUnit?.description || "",
  },
  { field: "minValue", headerName: "Min Value", flex: 1 },
  { field: "maxValue", headerName: "Max Value", flex: 1 },
  {
    field: "updateOnReport",
    headerName: "Update On Report",
    flex: 1,
    type: "boolean",
  },
  {
    field: "useOperationalValues",
    headerName: "Use Operational Values",
    flex: 1,
    type: "boolean",
  },
];

/* ================= Component ================= */

const TabMeasuresPage = ({ compTypeJob }: Props) => {
  const compTypeJobId = compTypeJob?.compTypeJobId;
  const compTypeId = compTypeJob?.compTypeId;
  const label = compTypeJob?.tblJobDescription?.jobDescTitle || "";

  // ---- UI State
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // ---- Effect / Confirm State
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [effectId, setEffectId] = useState<number | null>(null);
  const [effectOperation, setEffectOperation] = useState<0 | 1 | 2 | null>(
    null,
  );
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  /* ================= Data ================= */

  const getAll = useCallback(() => {
    return tblCompTypeJobMeasurePoint.getAll({
      include: {
        tblCompTypeMeasurePoint: {
          include: {
            tblUnit: true,
            tblCounterType: true,
          },
        },
      },
      filter: { compTypeJobId },
    });
  }, [compTypeJobId]);

  const { rows, loading, handleRefresh } = useDataGrid(
    getAll,
    undefined as any,
    "compTypeJobMeasurePointId",
    !!compTypeJobId,
  );

  /* ================= Handlers ================= */

  const handleCreate = () => {
    setSelectedId(null);
    setMode("create");
    setOpenForm(true);
  };

  const handleEdit = (rowId: number) => {
    setSelectedId(rowId);
    setMode("update");
    setOpenForm(true);
  };

  const handleAskDelete = (rowId: number) => {
    setPendingDeleteId(rowId);
    setEffectId(rowId);
    setEffectOperation(2);
    setConfirmOpen(true);
  };

  const handleUpsertSuccess = (data: TypeTblCompTypeJobMeasurePoint) => {
    setEffectId(data.compTypeJobMeasurePointId);
    setEffectOperation(mode === "create" ? 0 : 1);
    setConfirmOpen(true);
  };

  const resetConfirmState = () => {
    setConfirmOpen(false);
    setEffectId(null);
    setEffectOperation(null);
    setPendingDeleteId(null);
  };

  /* ================= Confirm Actions ================= */

  const handleConfirmYes = async () => {
    try {
      if (effectId !== null && effectOperation !== null) {
        await logicTblCompTypeJobMeasurePoint.effect(effectId, effectOperation);
      }

      if (effectOperation === 2 && pendingDeleteId !== null) {
        await tblCompTypeJobMeasurePoint.deleteById(pendingDeleteId);
      }

      toast.success("Changes applied successfully");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to apply changes");
    } finally {
      resetConfirmState();
      handleRefresh();
    }
  };

  const handleConfirmNo = async () => {
    if (effectOperation === 2 && pendingDeleteId !== null) {
      await tblCompTypeJobMeasurePoint.deleteById(pendingDeleteId);
    }
    resetConfirmState();
    handleRefresh();
  };

  /* ================= Render ================= */

  return (
    <>
      <CustomizedDataGrid
        label={label}
        showToolbar={!!label}
        rows={rows}
        loading={loading}
        columns={columns}
        onAddClick={handleCreate}
        onEditClick={handleEdit}
        onDoubleClick={handleEdit}
        onDeleteClick={handleAskDelete}
        onRefreshClick={handleRefresh}
        getRowId={getRowId}
      />

      <JobMeasureUpsert
        open={openForm}
        mode={mode}
        recordId={selectedId}
        compTypeJobId={compTypeJobId!}
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
