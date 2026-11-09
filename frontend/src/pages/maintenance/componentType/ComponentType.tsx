import Splitter from "@/shared/components/Splitter/Splitter";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import ComponentTypeUpsert from "./ComponentTypeUpsert";
import ConfirmDialog from "@/shared/components/ConfirmDialog";
import { useRouter } from "@tanstack/react-router";
import { useDataTree } from "@/shared/hooks/useDataTree";
import { mapToTree } from "@/shared/components/tree/TreeUtil";
import { GenericTree } from "@/shared/components/tree/Tree";
import { useUpsertDialog } from "@/shared/hooks/useUpsertDialog";
import { useCallback, useMemo, useState } from "react";
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

  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);

  const treeActions = useMemo(
    () => [
      {
        label: "Open Detail",
        onClick: (item: TypeTblCompType) =>
          handleRowDoubleClick(item.compTypeId),
      },
      {
        label: "Edit",
        onClick: (item: TypeTblCompType) => openEdit(item.compTypeId),
      },
      {
        label: "Delete",
        onClick: (item: TypeTblCompType) => setDeleteItemId(item.compTypeId),
      },
    ],
    [handleRowDoubleClick, openEdit, handleDelete],
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
          onDoubleClick={openEdit}
          contextMenuItems={treeActions}
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
          onView={openView}
        />
      </Splitter>

      {/* UPSERT */}
      <ComponentTypeUpsert entityName="ComponentType" {...dialogProps} />

      <ConfirmDialog
        open={deleteItemId !== null}
        title="Delete Item"
        message="Are you sure you want to delete this item?"
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
        onCancel={() => setDeleteItemId(null)}
        onConfirm={async () => {
          if (deleteItemId !== null) {
            await handleDelete(deleteItemId);
          }

          setDeleteItemId(null);
        }}
      />
    </>
  );
}
