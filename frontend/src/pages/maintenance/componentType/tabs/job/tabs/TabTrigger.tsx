import Upsert from "./TabTriggerUpsert";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import ConfirmDialog from "@/shared/components/ConfirmDialog";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import { useCallback, useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { toast } from "sonner";
import {
  tblCompTypeJobTrigger,
  tblJobTrigger,
  TypeTblCompTypeJob,
  TypeTblCompTypeJobTrigger,
} from "@/core/api/generated/api";
import { logicTblCompTypeJobTrigger } from "@/core/api/api";

type Props = {
  compTypeJob?: TypeTblCompTypeJob;
};

const getRowId = (row: TypeTblCompTypeJobTrigger) => row.compTypeJobTriggerId;

const columns: GridColDef<TypeTblCompTypeJobTrigger>[] = [
  {
    field: "trigger",
    headerName: "Trigger",
    flex: 1,
    valueGetter: (_, row) => row.tblJobTrigger?.descr,
  },
  { field: "orderNo", headerName: "Order", width: 80 },
];

const TabTrigger = ({ compTypeJob }: Props) => {
  const compTypeJobId = compTypeJob?.compTypeJobId;
  const compTypeId = compTypeJob?.compTypeId;

  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [effectId, setEffectId] = useState<number | null>(null);
  const [effectOperation, setEffectOperation] = useState<0 | 1 | 2 | null>(
    null,
  );
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const label = compTypeJob?.tblJobDescription?.jobDescTitle || "";

  // === getAll ===
  const getAll = useCallback(() => {
    return tblCompTypeJobTrigger.getAll({
      include: {
        tblJobTrigger: true,
      },
      filter: {
        compTypeJobId,
      },
    });
  }, [compTypeJobId]);

  // === useDataGrid ===
  const { rows, loading, handleDelete, handleRefresh } = useDataGrid(
    getAll,
    tblCompTypeJobTrigger.deleteById,
    "compTypeJobTriggerId",
    !!compTypeJobId,
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

  const handleUpsertSuccess = (data: TypeTblCompTypeJobTrigger) => {
    setEffectId(data.compTypeJobTriggerId);
    setEffectOperation(mode === "create" ? 0 : 1);
    setConfirmOpen(true);
  };

  const handleAskDelete = (rowId: number) => {
    setPendingDeleteId(rowId);
    setEffectId(rowId);
    setEffectOperation(2);
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
        await logicTblCompTypeJobTrigger.effect(effectId, effectOperation);
      }

      if (effectOperation === 2 && pendingDeleteId !== null) {
        await tblCompTypeJobTrigger.deleteById(pendingDeleteId);
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
      await tblCompTypeJobTrigger.deleteById(pendingDeleteId);
    }

    resetConfirmState();
    handleRefresh();
  };

  return (
    <>
      <CustomizedDataGrid
        disableEdit
        label={label}
        showToolbar={!!label}
        rows={rows}
        columns={columns}
        loading={loading}
        onRefreshClick={handleRefresh}
        onAddClick={handleCreate}
        onDeleteClick={handleAskDelete}
        onEditClick={handleEdit}
        onDoubleClick={handleEdit}
        getRowId={getRowId}
      />

      <Upsert
        open={openForm}
        mode={mode}
        recordId={selectedId!}
        compTypeJobId={compTypeJobId!}
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

export default TabTrigger;
