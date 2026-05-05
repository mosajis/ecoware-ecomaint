import Splitter from "@/shared/components/Splitter/Splitter";
import LocationUpsert from "./LocationUpsert";
import DataGrid from "@/shared/components/dataGrid/DataGrid";
import { tblLocation, TypeTblLocation } from "@/core/api/generated/api";
import { useDataTree } from "@/shared/hooks/useDataTree";
import { useCallback } from "react";
import { GenericTree } from "@/shared/components/tree/Tree";
import { mapToTree } from "@/shared/components/tree/TreeUtil";
import { useUpsertDialog } from "@/shared/hooks/useUpsertDialog";
import { columns, getRowId } from "./LocationColumns";

const getItemName = (row: TypeTblLocation) => row.name || "-";

export default function PageLocation() {
  const { openView, openCreate, openEdit, dialogProps } = useUpsertDialog({
    onSuccess: () => refetch(),
  });

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

  const label = "Location";

  return (
    <Splitter initialPrimarySize="35%">
      <GenericTree<TypeTblLocation>
        label="Tree View"
        elementId={200}
        loading={loading}
        data={tree}
        onDelete={handleDelete}
        onEdit={openEdit}
        onDoubleClick={openView}
        onAdd={openCreate}
        onRefresh={refetch}
        getItemName={getItemName}
        getItemId={getRowId}
      />

      <DataGrid
        label="List View"
        elementId={200}
        showToolbar
        disableRowNumber
        loading={loading}
        rows={rows}
        columns={columns}
        onDoubleClick={openView}
        onEditClick={openEdit}
        onDeleteClick={handleDelete}
        onRefreshClick={refetch}
        onAddClick={openCreate}
        getRowId={getRowId}
      >
        <LocationUpsert entityName={label} {...dialogProps} />
      </DataGrid>
    </Splitter>
  );
}
