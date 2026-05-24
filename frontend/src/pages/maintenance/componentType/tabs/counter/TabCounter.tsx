import CounterUpsert from "./TabCounterUpsert";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import ConfirmDialog from "@/shared/components/ConfirmDialog";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import { useCallback, useState } from "react";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import {
  tblCompTypeCounter,
  TypeTblCompType,
  TypeTblCompTypeCounter,
} from "@/core/api/generated/api";
import { toast } from "sonner";
import { effectTblCompTypeCounter } from "@/core/api/apiEffects";
import { columns, getRowId } from "./TabCounterColumns";

type Props = {
  compType?: TypeTblCompType;
  label?: string;
};

const TabCounter = ({ compType, label }: Props) => {
  const compTypeId = compType?.compTypeId;

  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [effectId, setEffectId] = useState<number | null>(null);
  const [effectOperation, setEffectOperation] = useState<0 | 1 | 2 | null>(
    null,
  );
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  // === getAll ===
  const getAll = useCallback(() => {
    return tblCompTypeCounter.getAll({
      include: {
        tblCounterType: true,
        tblCompTypeJobCounters: true,
      },
      filter: {
        compTypeId,
      },
    });
  }, [compTypeId]);

  // === useDataGrid ===
  const { rows, loading, handleDelete, handleRefresh } = useDataGrid(
    getAll,
    tblCompTypeCounter.deleteById,
    "compTypeCounterId",
    !!compTypeId,
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

  const handleAskDelete = (rowId: number) => {
    setPendingDeleteId(rowId);
    setEffectId(rowId);
    setEffectOperation(2);
    setConfirmOpen(true);
  };

  const handleUpsertSuccess = (data: TypeTblCompTypeCounter) => {
    setEffectId(data.compTypeCounterId);
    setEffectOperation(mode === "create" ? 0 : 1);
    setConfirmOpen(true);
  };

  const resetConfirmState = () => {
    setConfirmOpen(false);
    setEffectId(null);
    setEffectOperation(null);
    setPendingDeleteId(null);
  };

  const handleConfirmYes = async () => {
    try {
      if (effectId !== null && effectOperation !== null) {
        await effectTblCompTypeCounter(effectId, effectOperation);
      }

      if (effectOperation === 2 && pendingDeleteId) {
        await tblCompTypeCounter.deleteById(pendingDeleteId);
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
    if (effectOperation === 2 && pendingDeleteId) {
      await tblCompTypeCounter.deleteById(pendingDeleteId);
    }

    resetConfirmState();
    handleRefresh();
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
        rows={rows}
        columns={columns}
        loading={loading}
        onAddClick={handleCreate}
        onDeleteClick={handleAskDelete}
        onDoubleClick={handleEdit}
        onEditClick={handleEdit}
        onRefreshClick={handleRefresh}
        getRowId={getRowId}
      />

      <CounterUpsert
        open={openForm}
        mode={mode}
        recordId={selectedId}
        compTypeId={compTypeId!}
        onClose={handleUpsertClose}
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

export default TabCounter;
