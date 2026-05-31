import Splitter from "@/shared/components/Splitter/Splitter";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import ComponentTypeUpsert from "./ComponentTypeUpsert";

import { useRouter } from "@tanstack/react-router";
import { useDataTree } from "@/shared/hooks/useDataTree";
import { mapToTree } from "@/shared/components/tree/TreeUtil";
import { GenericTree } from "@/shared/components/tree/Tree";
import { useUpsertDialog } from "@/shared/hooks/useUpsertDialog";
import { useCallback } from "react";
import { tblCompType, TypeTblCompType } from "@/core/api/generated/api";
import { columns, getItemName, getRowId } from "./ComponentTypeColumn";
import { RouteDetail } from "./ComponentTypeRoutes";

export default function PageComponentType() {
  const router = useRouter();

  const treeMapper = useCallback(
    (items: TypeTblCompType[]) =>
      mapToTree(items, "compTypeId", "parentCompTypeId"),
    [],
  );

  const { rows, tree, loading, refetch, handleDelete } =
    useDataTree<TypeTblCompType>({
      getAll: tblCompType.getAll,
      deleteById: tblCompType.deleteById,
      getId: getRowId,
      mapper: treeMapper,
    });

  const { openCreate, openEdit, openView, dialogProps } = useUpsertDialog({
    onSuccess: refetch,
  });

  const handleRowDoubleClick = useCallback(
    (rowId: number) => {
      const row = rows.find((i) => i.compTypeId === rowId);
      if (!row) return;

      const href = router.buildLocation({
        to: RouteDetail.to,
        params: { id: rowId },
        search: {
          breadcrumb: row.compName ?? "",
        },
      }).href;

      window.open(href, "_blank");
    },
    [router, rows],
  );

  return (
    <>
      <Splitter initialPrimarySize="30%">
        {/* TREE */}
        <GenericTree<TypeTblCompType>
          label="Tree View"
          elementId={1320}
          loading={loading}
          data={tree}
          getItemId={getRowId}
          getItemName={getItemName}
          onEdit={openEdit}
          onDelete={handleDelete}
          onAdd={openCreate}
          onRefresh={refetch}
          onDoubleClick={handleRowDoubleClick}
        />

        {/* GRID */}
        <CustomizedDataGrid
          showToolbar
          disableRowNumber
          label="List View"
          elementId={1320}
          rows={rows}
          columns={columns}
          loading={loading}
          getRowId={getRowId}
          onEditClick={openEdit}
          onDeleteClick={handleDelete}
          onAddClick={openCreate}
          onRefreshClick={refetch}
          onDoubleClick={openView}
        />
      </Splitter>

      {/* UPSERT */}
      <ComponentTypeUpsert entityName="ComponentType" {...dialogProps} />
    </>
  );
}
