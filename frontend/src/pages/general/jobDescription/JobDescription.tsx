import Splitter from "@/shared/components/Splitter/Splitter";
import JobDescriptionUpsert from "./JobDescriptionUpsert";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useCallback, useState } from "react";
import { Tabs } from "./JobDescriptionTabs";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { columns, getRowId } from "./JobDescriptionColumns";
import { useDialogs } from "@/shared/hooks/useDialogs";
import {
  tblJobDescription,
  TypeTblJobDescription,
} from "@/core/api/generated/api";

export default function PageJobDescription() {
  const [mode, setMode] = useState<"create" | "update">("create");
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [label, setLabel] = useState<string | null>(null);

  const { dialogs, openDialog, closeDialog } = useDialogs({
    upsert: false,
  });

  // === DataGrid ===
  const getAll = useCallback(() => {
    return tblJobDescription.getAll({
      include: { tblJobClass: true },
    });
  }, []);

  const { rows, loading, handleRefresh, handleDelete } = useDataGrid(
    getAll,
    tblJobDescription.deleteById,
    "jobDescId",
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

  const handleRowClick = useCallback(
    ({ row }: { row: TypeTblJobDescription }) => {
      setSelectedRowId(row.jobDescId);
      setLabel(row.jobDescTitle);
    },
    [],
  );

  return (
    <>
      <Splitter initialPrimarySize="45%" resetOnDoubleClick>
        <CustomizedDataGrid
          showToolbar
          disableRowNumber
          disableRefresh
          disableColumns
          label="Job Description"
          elementId={1000}
          loading={loading}
          rows={rows}
          columns={columns}
          onAddClick={handleCreate}
          onRefreshClick={handleRefresh}
          onDoubleClick={handleEdit}
          onEditClick={handleEdit}
          onDeleteClick={handleDelete}
          onRowClick={handleRowClick}
          getRowId={getRowId}
        />

        <Tabs label={label} jobDescriptionId={selectedRowId} />
      </Splitter>

      <JobDescriptionUpsert
        open={dialogs.upsert}
        mode={mode}
        recordId={selectedRowId}
        onClose={() => closeDialog("upsert")}
        onSuccess={handleRefresh}
      />
    </>
  );
}
