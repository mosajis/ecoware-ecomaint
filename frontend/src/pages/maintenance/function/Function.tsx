import Splitter from "@/shared/components/Splitter/Splitter";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import FunctionUpsert from "./FunctionUpsert";
import DialogInstallRemoveComponent from "./_components/DialogInstallRemoveComponent";
import FunctionActions from "./FunctionActions";
import { useRouter } from "@tanstack/react-router";
import { useDataTree } from "@/shared/hooks/useDataTree";
import { mapToTree } from "@/shared/components/tree/TreeUtil";
import { GenericTree } from "@/shared/components/tree/Tree";
import { useDialogs } from "@/shared/hooks/useDialogs";
import { useCallback, useState, useMemo } from "react";
import { routeDetail } from "./FunctionRoutes";
import { columns, getItemName, getRowId } from "./FunctionColumn";
import { tblFunction, TypeTblFunction } from "@/core/api/generated/api";

export default function PageFunction() {
  const router = useRouter();

  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  const { dialogs, openDialog, closeDialog } = useDialogs({
    upsert: false,
    install: false,
    remove: false,
  });

  const getAll = useCallback(() => {
    return tblFunction.getAll({
      include: { tblComponentUnit: true },
    });
  }, []);

  const treeMapper = useCallback(
    (items: TypeTblFunction[]) =>
      mapToTree(items, "functionId", "parentFunctionId"),
    [],
  );

  const { rows, tree, loading, refetch, handleDelete } =
    useDataTree<TypeTblFunction>({
      getAll,
      deleteById: tblFunction.deleteById,
      getId: (item) => item.functionId,
      mapper: treeMapper,
    });

  const selectedRow = useMemo(() => {
    if (!selectedRowId) return null;
    return rows.find((r) => r.functionId === selectedRowId) || null;
  }, [selectedRowId, rows]);

  const handleRowClick = (params: any) => {
    setSelectedRowId(params.row.functionId);
  };

  const handleCreate = useCallback(() => {
    setSelectedRowId(null);
    openDialog("upsert");
  }, []);

  const handleEdit = useCallback((rowId: number) => {
    setSelectedRowId(rowId);
    openDialog("upsert");
  }, []);

  const handleRowDoubleClick = useCallback(
    (rowId: number) => {
      const row = rows.find((i) => i.functionId === rowId);
      if (!row) return;
      router.navigate({
        to: routeDetail.to,
        params: { id: rowId },
        search: { breadcrumb: row?.funcNo },
      });
    },
    [router, rows],
  );

  return (
    <>
      <Splitter initialPrimarySize="35%">
        <GenericTree<TypeTblFunction>
          elementId={1430}
          loading={loading}
          data={tree}
          onDoubleClick={handleRowDoubleClick}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={handleCreate}
          getItemId={getRowId}
          getItemName={getItemName}
        />

        <CustomizedDataGrid
          showToolbar
          label="List View"
          elementId={1430}
          rows={rows}
          columns={columns}
          loading={loading}
          getRowId={getRowId}
          onEditClick={handleEdit}
          onDeleteClick={handleDelete}
          onDoubleClick={handleRowDoubleClick}
          onAddClick={handleCreate}
          onRefreshClick={refetch}
          onRowClick={handleRowClick}
          toolbarChildren={
            <FunctionActions
              selectedRow={selectedRow}
              onInstall={() => openDialog("install")}
              onRemove={() => openDialog("remove")}
            />
          }
        />
      </Splitter>

      <FunctionUpsert
        open={dialogs.upsert}
        mode={selectedRowId ? "update" : "create"}
        recordId={selectedRowId}
        onClose={() => closeDialog("upsert")}
        onSuccess={refetch}
      />

      {selectedRow && (
        <>
          <DialogInstallRemoveComponent
            open={dialogs.install}
            mode="install"
            functionId={selectedRow.functionId}
            compId={selectedRow.compId}
            onClose={() => closeDialog("install")}
            onSuccess={refetch}
          />

          <DialogInstallRemoveComponent
            open={dialogs.remove}
            mode="remove"
            functionId={selectedRow.functionId}
            compId={selectedRow.compId}
            onClose={() => closeDialog("remove")}
            onSuccess={refetch}
          />
        </>
      )}
    </>
  );
}
