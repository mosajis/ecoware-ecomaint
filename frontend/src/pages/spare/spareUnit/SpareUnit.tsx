import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import SpareUnitUpsert from "./SpareUnitUpsert";
import { useCallback } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { tblSpareUnit, TypeTblSpareUnit } from "@/core/api/generated/api";
import { useUpsertDialog } from "@/shared/hooks/useUpsertDialog";
import { columns, getRowId } from "./SpareUnitColumn";

export default function PageSpareUnit() {
  const getAll = useCallback(
    () =>
      tblSpareUnit.getAll({
        include: {
          tblSpareType: true,
        },
      }),
    [],
  );

  const { rows, loading, handleDelete, handleRefresh } = useDataGrid(
    getAll,
    tblSpareUnit.deleteById,
    "spareUnitId",
  );

  const { openCreate, openEdit, openView, dialogProps } = useUpsertDialog({
    onSuccess: handleRefresh,
  });

  const label = "Spare Unit";

  return (
    <>
      <CustomizedDataGrid
        showToolbar
        label={label}
        elementId={1520}
        loading={loading}
        rows={rows}
        columns={columns}
        onAddClick={openCreate}
        onEditClick={openEdit}
        onDoubleClick={openView}
        onDeleteClick={handleDelete}
        onRefreshClick={handleRefresh}
        getRowId={getRowId}
      />

      <SpareUnitUpsert entityName={label} {...dialogProps} />
    </>
  );
}
