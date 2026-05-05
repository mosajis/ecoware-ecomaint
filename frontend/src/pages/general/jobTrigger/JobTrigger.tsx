import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import Upsert from "./JobTriggerUpsert";
import Splitter from "@/shared/components/Splitter/Splitter";
import Actions from "./JobTriggerActions";

import { useCallback, useState } from "react";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { useUpsertDialog } from "@/shared/hooks/useUpsertDialog";
import { tblJobTrigger, TypeTblJobTrigger } from "@/core/api/generated/api";
import { Tabs } from "./JobTriggerTabs";

import { toast } from "sonner";
import { columns, getRowId } from "./JobTriggerColumns";
import { effectTblCompTypeJobTrigger } from "@/core/api/apiEffects";

export default function PageJobTrigger() {
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [fireLoading, setFireLoading] = useState(false);

  // === DataGrid ===
  const { rows, loading, handleDelete, handleRefresh } = useDataGrid(
    tblJobTrigger.getAll,
    tblJobTrigger.deleteById,
    "jobTriggerId",
  );

  // === Upsert Dialog (NEW PATTERN) ===
  const { openView, openCreate, openEdit, dialogProps } =
    useUpsertDialog<TypeTblJobTrigger>({
      onSuccess: handleRefresh,
    });

  // === Row click (UI only) ===
  const handleRowClick = useCallback(({ row }: { row: TypeTblJobTrigger }) => {
    setSelectedRowId(row.jobTriggerId);
    setLabel(row.descr);
  }, []);

  // === Fire trigger ===
  const onFireTrigger = async () => {
    // if (selectedRowId) {
    //   setFireLoading(true);
    //   effectTblCompTypeJobTrigger(selectedRowId as any, 0)
    //     .then((res) => {
    //       toast.success(res.message);
    //     })
    //     .catch(() => {
    //       toast.error("Failed to fire trigger");
    //     })
    //     .finally(() => {
    //       setFireLoading(false);
    //     });
    // }
  };

  return (
    <Splitter initialPrimarySize="40%" resetOnDoubleClick>
      <CustomizedDataGrid
        showToolbar
        disableRowNumber
        disableRefresh
        disableFilters
        elementId={1100}
        label="Job Triggers"
        rows={rows}
        columns={columns}
        loading={loading}
        getRowId={getRowId}
        onAddClick={openCreate}
        onEditClick={openEdit}
        onDoubleClick={openView}
        onDeleteClick={handleDelete}
        onRowClick={handleRowClick}
        onRefreshClick={handleRefresh}
        // toolbarChildren={
        // <Actions onFireTrigger={onFireTrigger} fireLoading={fireLoading} />
        // }
      >
        <Upsert entityName="Job Trigger" {...dialogProps} />
      </CustomizedDataGrid>

      <Tabs label={label} jobTriggerId={selectedRowId} />
    </Splitter>
  );
}
