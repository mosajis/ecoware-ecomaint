import Splitter from "@/shared/components/Splitter/Splitter";
import LocationUpsert from "./LocationUpsert";
import GenericDataGrid from "@/shared/components/dataGrid/DataGrid";
import { tblLocation, TypeTblLocation } from "@/core/api/generated/api";
import { useDataTree } from "@/shared/hooks/useDataTree";
import { useState, useCallback } from "react";
import { GenericTree } from "@/shared/components/tree/Tree";
import { mapToTree } from "@/shared/components/tree/TreeUtil";
import { useDialogs } from "@/shared/hooks/useDialogs";
import { columns, getRowId } from "./LocationColumns";

const getItemName = (row: TypeTblLocation) => row.name || "-";

export default function PageLocation() {
  const { dialogs, openDialog, closeDialog } = useDialogs({
    upsert: false,
  });

  const [mode, setMode] = useState<"create" | "update">("create");
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  const treeMapper = useCallback(
    (items: TypeTblLocation[]) =>
      mapToTree(items, "locationId", "parentLocationId"),
    [],
  );

  const getAll = useCallback(
    () =>
      tblLocation.getAll({
        include: {
          tblLocation: true,
        },
      }),
    [],
  );

  const { tree, rows, loading, refetch, handleDelete } =
    useDataTree<TypeTblLocation>({
      getAll,
      deleteById: tblLocation.deleteById,
      getId: getRowId,
      mapper: treeMapper,
    });

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

  return (
    <>
      <Splitter initialPrimarySize="35%">
        <GenericTree<TypeTblLocation>
          label="Tree View"
          loading={loading}
          data={tree}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onDoubleClick={handleEdit}
          onAdd={handleCreate}
          onRefresh={refetch}
          getItemName={getItemName}
          getItemId={getRowId}
        />

        <GenericDataGrid
          label="List View"
          showToolbar
          disableRowNumber
          loading={loading}
          rows={rows}
          columns={columns}
          onDoubleClick={handleEdit}
          onEditClick={handleEdit}
          onDeleteClick={handleDelete}
          onRefreshClick={refetch}
          onAddClick={handleCreate}
          getRowId={getRowId}
        />
      </Splitter>

      <LocationUpsert
        open={dialogs.upsert}
        mode={mode}
        recordId={selectedRowId}
        onClose={() => closeDialog("upsert")}
        onSuccess={refetch}
      />
    </>
  );
}
