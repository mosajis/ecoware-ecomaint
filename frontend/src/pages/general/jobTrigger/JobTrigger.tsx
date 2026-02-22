import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import Upsert from "./JobTriggerUpsert";
import Splitter from "@/shared/components/Splitter/Splitter";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useCallback, useState } from "react";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { tblJobTrigger, TypeTblJobTrigger } from "@/core/api/generated/api";
import { Tabs } from "./JobTriggerTabs";
import { useAtomValue } from "jotai";
import { atomUser } from "@/pages/auth/auth.atom";
import { toast } from "sonner";
import { columns, getRowId } from "./JobTriggerColumns";
import { useDialogs } from "@/shared/hooks/useDialogs";
import { effectTblCompTypeJobTrigger } from "@/core/api/apiEffects";

export default function PageJobTrigger() {
  const [_loading, setLoading] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<null | number>(null);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [label, setLabel] = useState<string | null>(null);

  const { dialogs, openDialog, closeDialog } = useDialogs({
    upsert: false,
  });

  const user = useAtomValue(atomUser);
  const userId = user?.userId as number;

  // === useDataGrid ===
  const { rows, loading, handleDelete, handleRefresh } = useDataGrid(
    tblJobTrigger.getAll,
    tblJobTrigger.deleteById,
    "jobTriggerId",
  );

  // === Handlers ===
  const handleCreate = useCallback(() => {
    setSelectedRowId(null);
    setMode("create");
    openDialog("upsert");
  }, []);

  const handleEdit = useCallback((rowId: number) => {
    setSelectedRowId(rowId);
    setMode("update");
    openDialog("upsert");
  }, []);

  const handleRowClick = useCallback(({ row }: { row: TypeTblJobTrigger }) => {
    setSelectedRowId(row.jobTriggerId);
    setLabel(row.descr);
  }, []);

  const onFireTrigger = async () => {
    if (selectedRowId) {
      setLoading(true);
      effectTblCompTypeJobTrigger(userId, selectedRowId as any)
        .then((res) => {
          toast.success(res.message);
        })
        .catch(() => {
          toast.error("Failed to fire trigger");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <Box height={"calc(100% - 50px)"}>
      <Button
        onClick={onFireTrigger}
        variant="outlined"
        sx={{ mb: 1 }}
        loading={_loading}
        disabled={loading || _loading || !selectedRowId}
      >
        Fire Trigger
      </Button>
      <Splitter initialPrimarySize="35%" resetOnDoubleClick>
        <CustomizedDataGrid
          showToolbar
          disableRowNumber
          disableRefresh
          disableFilters
          label="Job Triggers"
          rows={rows}
          columns={columns}
          loading={loading}
          onAddClick={handleCreate}
          onRefreshClick={handleRefresh}
          onDeleteClick={handleDelete}
          onEditClick={handleEdit}
          onDoubleClick={handleEdit}
          onRowClick={handleRowClick}
          getRowId={getRowId}
        />
        <Tabs label={label} jobTriggerId={selectedRowId} />
      </Splitter>

      <Upsert
        open={dialogs.upsert}
        mode={mode}
        recordId={selectedRowId}
        onClose={() => closeDialog("upsert")}
        onSuccess={handleRefresh}
      />
    </Box>
  );
}
