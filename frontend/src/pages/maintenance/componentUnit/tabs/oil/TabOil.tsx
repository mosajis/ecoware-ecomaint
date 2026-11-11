import DataGrid from "@/shared/components/dataGrid/DataGrid";
import { useCallback } from "react";
import { tblCompOilInfo, TypeTblComponentUnit } from "@/core/api/generated/api";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { columns, getRowId } from "./TabOilColumns";
import TabOilUpsert from "./TabOilUpsert";
import { useUpsertDialog } from "@/shared/hooks/useUpsertDialog";

interface Props {
  componentUnit?: TypeTblComponentUnit;
  label?: string;
}

export default function TabOil({ componentUnit }: Props) {
  const compId = componentUnit?.compId;

  const getAll = useCallback(
    () =>
      tblCompOilInfo.getAll({
        filter: {
          compId: compId,
        },
        include: {
          tblEmployee: true,
          tblInstallation: true,
          // tblComponentUnit: true,
          // tblCompCounter: true,
          // tblSpareType: true,
          // tblCompJob: true,
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

  const label = "Oil Info";

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
      <TabOilUpsert entityName={label} {...dialogProps} />
    </DataGrid>
  );
}
