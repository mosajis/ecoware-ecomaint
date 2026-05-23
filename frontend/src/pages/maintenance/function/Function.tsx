import Splitter from "@/shared/components/Splitter/Splitter";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import FunctionUpsert from "./FunctionUpsert";
import DialogInstallRemoveComponent from "./_components/DialogInstallRemoveComponent";
import FunctionActions from "./FunctionActions";

import { useRouter } from "@tanstack/react-router";
import { useDataTree } from "@/shared/hooks/useDataTree";
import { mapToTree } from "@/shared/components/tree/TreeUtil";
import { GenericTree } from "@/shared/components/tree/Tree";
import { useUpsertDialog } from "@/shared/hooks/useUpsertDialog";
import { useCallback, useMemo, useState } from "react";
import { RouteDetail } from "./FunctionRoutes";
import { columns, getItemName, getRowId } from "./FunctionColumn";
import { tblFunction, TypeTblFunction } from "@/core/api/generated/api";
import { PERMIT_ID } from "./FunctionPermit";
import { useDialogs } from "@/shared/hooks/useDialogs";

export default function PageFunction() {
  const router = useRouter();

  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

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

  const { dialogs, openDialog, closeDialog } = useDialogs({
    install: false,
    remove: false,
  });

  const { openCreate, openEdit, openView, dialogProps } = useUpsertDialog({
    onSuccess: refetch,
  });

  const handleRowClick = useCallback((params: any) => {
    setSelectedRowId(params.row.functionId);
  }, []);

  const handleNavigateDetail = useCallback(
    (rowId: number) => {
      const row = rows.find((i) => i.functionId === rowId);
      if (!row) return;

      router.navigate({
        to: RouteDetail.to,
        params: { id: rowId },
        search: { breadcrumb: row.funcNo },
      });
    },
    [router, rows],
  );
  return (
    <>
      <Splitter initialPrimarySize="35%">
        {/* TREE VIEW */}
        <GenericTree<TypeTblFunction>
          elementId={PERMIT_ID}
          loading={loading}
          data={tree}
          getItemId={getRowId}
          getItemName={getItemName}
          onEdit={openEdit}
          onDelete={handleDelete}
          onAdd={openCreate}
          onDoubleClick={handleNavigateDetail}
        />

        {/* GRID VIEW */}
        <CustomizedDataGrid
          showToolbar
          label="List View"
          elementId={PERMIT_ID}
          rows={rows}
          columns={columns}
          loading={loading}
          getRowId={getRowId}
          onRowClick={handleRowClick}
          onEditClick={openEdit}
          onDeleteClick={handleDelete}
          onAddClick={openCreate}
          onRefreshClick={refetch}
          onDoubleClick={openView}
          toolbarChildren={
            <FunctionActions
              selectedRow={selectedRow}
              onInstall={() => openDialog("install")}
              onRemove={() => openDialog("remove")}
            />
          }
        />
      </Splitter>

      {/* UPSERT */}
      <FunctionUpsert entityName="Function" {...dialogProps} />

      {/* INSTALL */}
      <DialogInstallRemoveComponent
        open={dialogs.install}
        mode="install"
        functionId={selectedRow?.functionId!}
        compId={selectedRow?.compId}
        onClose={() => closeDialog("install")}
        onSuccess={refetch}
      />

      {/* REMOVE */}
      <DialogInstallRemoveComponent
        open={dialogs.remove}
        mode="remove"
        functionId={selectedRow?.functionId!}
        compId={selectedRow?.compId}
        onClose={() => closeDialog("remove")}
        onSuccess={refetch}
      />
    </>
  );
}
