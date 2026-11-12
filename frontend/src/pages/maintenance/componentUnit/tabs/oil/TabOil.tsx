import DataGrid from "@/shared/components/dataGrid/DataGrid";
import TabOilUpsert from "./TabOilUpsert";
import { useCallback } from "react";
import { tblCompOilInfo, TypeTblComponentUnit } from "@/core/api/generated/api";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { columns, getRowId } from "./TabOilColumns";
import { useUpsertDialog } from "@/shared/hooks/useUpsertDialog";

interface Props {
  componentUnit?: TypeTblComponentUnit;
  label?: string;
}

export default function TabOil({ componentUnit, label = "Oil Info" }: Props) {
  const compId = componentUnit?.compId;

  const getAll = useCallback(
    () =>
      tblCompOilInfo.getAll({
        filter: {
          compId,
        },
        include: {
          tblEmployee: true,
        },
      }),
    [compId],
  );

  const { rows, loading, handleDelete, handleRefresh } = useDataGrid(
    getAll,
    tblCompOilInfo.deleteById,
    "compOilInfoId",
    !!compId,
  );

  const { openCreate, openEdit, openView, dialogProps } = useUpsertDialog({
    onSuccess: handleRefresh,
  });

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
      onAddClick={openCreate}
      onEditClick={openEdit}
      onView={openView}
    >
      <TabOilUpsert
        compId={compId}
        entityName={label + " Oil Info"}
        {...dialogProps}
      />
    </DataGrid>
  );
}
