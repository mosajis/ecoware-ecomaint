import DataGrid from "@/shared/components/dataGrid/DataGrid";
import { useCallback } from "react";
import { tblCompSpare, TypeTblComponentUnit } from "@/core/api/generated/api";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { columns, getRowId } from "./TabPartColumns";

interface Props {
  componentUnit?: TypeTblComponentUnit;
  label?: string;
}

export default function TabPart() {
  const getAll = useCallback(() => tblCompSpare.getAll(), []);

  const { rows, loading, handleDelete, handleRefresh } = useDataGrid(
    getAll,
    tblCompSpare.deleteById,
    "compSpareId",
  );

  const label = "Spare Type";

  return (
    <DataGrid
      showToolbar
      label={label}
      loading={loading}
      rows={rows}
      columns={columns}
      getRowId={getRowId}
      onDeleteClick={handleDelete}
      onRefreshClick={handleRefresh}
    />
  );
}
