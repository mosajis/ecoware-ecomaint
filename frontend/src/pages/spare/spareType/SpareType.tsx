import DataGrid from "@/shared/components/dataGrid/DataGrid";
import SpareTypeUpsert from "./SpareTypeUpsert";
import { useCallback } from "react";
import { useDataTree } from "@/shared/hooks/useDataTree";
import { mapToTree } from "@/shared/components/tree/TreeUtil";
import { tblSpareType, TypeTblSpareType } from "@/core/api/generated/api";
import { columns, getRowId } from "./SpareTypeColumn";
import { useUpsertDialog } from "@/shared/hooks/useUpsertDialog";

export default function PageSpareType() {
  // === TREE MAPPER ===
  const treeMapper = useCallback(
    (items: TypeTblSpareType[]) =>
      mapToTree(items, "spareTypeId", "parentSpareTypeId"),
    [],
  );

  const getAll = useCallback(
    () =>
      tblSpareType.getAll({
        include: {
          tblUnit: true,
        },
      }),
    [],
  );

  // === DATA ===
  const { tree, rows, loading, refetch, handleDelete } =
    useDataTree<TypeTblSpareType>({
      getAll,
      deleteById: tblSpareType.deleteById,
      getId: getRowId,
      mapper: treeMapper,
    });

  const { openCreate, openEdit, openView, dialogProps } = useUpsertDialog({
    onSuccess: refetch,
  });

  const label = "Spare Type";

  return (
    <DataGrid
      showToolbar
      label={label}
      elementId={1510}
      loading={loading}
      rows={rows}
      columns={columns}
      getRowId={getRowId}
      onAddClick={openCreate}
      onEditClick={openEdit}
      onDoubleClick={openView}
      onDeleteClick={handleDelete}
      onRefreshClick={refetch}
    >
      <SpareTypeUpsert entityName={label} {...dialogProps} />
    </DataGrid>
  );
}
