import Splitter from "@/shared/components/Splitter/Splitter";
import JobDescriptionUpsert from "./JobDescriptionUpsert";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";

import { useCallback, useState } from "react";

import { Tabs } from "./JobDescriptionTabs";
import { useDataGrid } from "@/shared/hooks/useDataGrid";

import { columns, getRowId } from "./JobDescriptionColumns";

import {
  tblJobDescription,
  TypeTblJobDescription,
} from "@/core/api/generated/api";

import { useUpsertDialog } from "@/shared/hooks/useUpsertDialog";

export default function PageJobDescription() {
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [label, setLabel] = useState<string | null>(null);

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

  // === Upsert Dialog (NEW PATTERN) ===
  const { openCreate, openEdit, dialogProps } =
    useUpsertDialog<TypeTblJobDescription>({
      onSuccess: handleRefresh,
    });

  // === Row click (only UI state) ===
  const handleRowClick = useCallback(
    ({ row }: { row: TypeTblJobDescription }) => {
      setLabel(row.jobDescTitle);
      setSelectedRowId(row.jobDescId);
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
          getRowId={getRowId}
          onAddClick={openCreate}
          onEditClick={openEdit}
          onDoubleClick={openEdit}
          onDeleteClick={handleDelete}
          onRowClick={handleRowClick}
          onRefreshClick={handleRefresh}
        />

        <Tabs label={label} jobDescriptionId={selectedRowId} />
      </Splitter>

      <JobDescriptionUpsert entityName="Job Description" {...dialogProps} />
    </>
  );
}
