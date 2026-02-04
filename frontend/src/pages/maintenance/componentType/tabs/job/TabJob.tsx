import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import Splitter from "@/shared/components/Splitter/Splitter";
import Tabs from "./TabJobTabs";
import ComponentTypeJobUpsert from "./TabJobUpsert";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import ConfirmDialog from "@/shared/components/ConfirmDialog";
import CellFrequency from "@/shared/components/dataGrid/cells/CellFrequency";
import { toast } from "sonner";
import { GridColDef } from "@mui/x-data-grid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { useCallback, useState } from "react";
import {
  tblCompTypeJob,
  TypeTblCompType,
  TypeTblCompTypeJob,
} from "@/core/api/generated/api";
import { logicTblCompTypeJob } from "@/core/api/api";
import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";

// ================= Columns =================

type Props = {
  compType?: TypeTblCompType;
  label?: string;
};

const getRowId = (row: TypeTblCompTypeJob) => row.compTypeJobId;

const columns: GridColDef<TypeTblCompTypeJob>[] = [
  {
    field: "jobCode",
    headerName: "Code",
    width: 90,
    valueGetter: (_, row) => row.tblJobDescription?.jobDescCode,
  },
  {
    field: "jobName",
    headerName: "Title",
    flex: 2.5,
    valueGetter: (_, row) => row.tblJobDescription?.jobDescTitle,
  },
  {
    field: "frequency",
    headerName: "Frequency",
    renderCell: ({ row, value }) => (
      <CellFrequency frequency={value} frequencyPeriod={row.tblPeriod} />
    ),
  },
  {
    field: "discipline",
    headerName: "Discipline",
    flex: 1,
    valueGetter: (_, row) => row.tblDiscipline?.name,
  },
  {
    field: "maintClass",
    headerName: "MaintClass",
    flex: 1,
    valueGetter: (_, row) => row.tblMaintClass?.descr,
  },
  {
    field: "maintType",
    headerName: "MaintType",
    flex: 1,
    valueGetter: (_, row) => row.tblMaintType?.descr,
  },
  {
    field: "maintCause",
    headerName: "MaintCause",
    flex: 1,
    valueGetter: (_, row) => row.tblMaintCause?.descr,
  },
  {
    field: "priority",
    headerName: "Priority",
    width: 75,
  },
  {
    field: "window",
    headerName: "Window",
    width: 75,
  },
  {
    field: "planningMethod",
    headerName: "Method",
    width: 90,
    valueGetter: (_, row) => (row.planningMethod ? "Fixed" : "Variable"),
  },
  { field: "statusNone", headerName: "St-None", width: 85, type: "boolean" },
  { field: "statusInUse", headerName: "St-InUse", width: 85, type: "boolean" },
  {
    field: "statusAvailable",
    headerName: "St-Available",
    width: 95,
    type: "boolean",
  },
  {
    field: "statusRepair",
    headerName: "St-Repair",
    width: 90,
    type: "boolean",
  },
  {
    field: "lastDone",
    headerName: "Last Done",
    width: 150,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
  {
    field: "nextDueDate",
    headerName: "Next Due Date",
    width: 150,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
];

// ================= Component =================

const TabJob = ({ compType, label }: Props) => {
  const compTypeId = compType?.compTypeId;

  // ---- UI State
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [selectedRow, setSelectedRow] = useState<TypeTblCompTypeJob | null>(
    null,
  );

  // ---- Delete / Effect State
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteRow, setPendingDeleteRow] =
    useState<TypeTblCompTypeJob | null>(null);
  const [effectJobId, setEffectJobId] = useState<number | null>(null);
  const [effectOperation, setEffectOperation] = useState<0 | 1 | 2 | null>(
    null,
  );

  // ================= Data =================

  const getAll = useCallback(() => {
    return tblCompTypeJob.getAll({
      include: {
        tblPeriod: true,
        tblJobDescription: true,
        tblDiscipline: true,
        tblMaintClass: true,
        tblMaintType: true,
        tblMaintCause: true,
      },
      filter: { compTypeId },
    });
  }, [compTypeId]);

  const { rows, loading, handleRefresh } = useDataGrid(
    getAll,
    undefined as any, // no automatic delete
    "compTypeJobId",
    !!compTypeId,
  );

  // ================= Handlers =================

  const handleCreate = () => {
    setSelectedRowId(null);
    setMode("create");
    setOpenForm(true);
  };

  const handleEdit = (rowId: number) => {
    setSelectedRowId(rowId);
    setMode("update");
    setOpenForm(true);
  };

  const handleRowClick = ({ row }: { row: TypeTblCompTypeJob }) => {
    setSelectedRow(row);
  };

  const handleAskDelete = (rowId: number) => {
    const row = rows.find((r) => r.compTypeJobId === rowId);
    if (!row) return;

    setPendingDeleteRow(row);
    setEffectJobId(row.compTypeJobId);
    setEffectOperation(2); // DELETE
    setConfirmOpen(true);
  };

  const handleUpsertSuccess = (data: TypeTblCompTypeJob) => {
    setEffectJobId(data.compTypeJobId);
    setEffectOperation(mode === "create" ? 0 : 1);
    setConfirmOpen(true);
  };

  // ================= Confirm Logic =================

  const resetConfirmState = () => {
    setConfirmOpen(false);
    setPendingDeleteRow(null);
    setEffectJobId(null);
    setEffectOperation(null);
  };

  const handleConfirmYes = async () => {
    try {
      if (effectJobId !== null && effectOperation !== null) {
        await logicTblCompTypeJob.effect(effectJobId, effectOperation);
      }

      if (effectOperation === 2 && pendingDeleteRow) {
        await tblCompTypeJob.deleteById(pendingDeleteRow.compTypeJobId);
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
      await tblCompTypeJob.deleteById(pendingDeleteRow.compTypeJobId);
    }
    resetConfirmState();
    handleRefresh();
  };

  // ================= Render =================

  return (
    <>
      <Splitter horizontal initialPrimarySize="65%">
        <CustomizedDataGrid
          disableRowNumber
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
          onRowClick={handleRowClick}
        />

        <Tabs compTypeJob={selectedRow!} />
      </Splitter>

      <ComponentTypeJobUpsert
        open={openForm}
        mode={mode}
        recordId={selectedRowId}
        compType={compType as any}
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

export default TabJob;
