import Splitter from "@/shared/components/Splitter/Splitter";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import ComponentUnitUpsert from "./ComponentUnitUpsert";
import ReportWorkDialog from "../reportWork/ReportWorkDialog";
import ComponentUnitActions from "./ComponentUnitActions";
import WorkShopUpsert from "../workShop/WorkShopUpsert";
import ReportFailureUpsert from "@/pages/report/failureReport/FailureReportModal";
import { useRouter } from "@tanstack/react-router";
import { routeComponentUnitDetail } from "./ComponentUnitRoutes";
import { useDataTree } from "@/shared/hooks/useDataTree";
import { mapToTree } from "@/shared/components/tree/TreeUtil";
import { GenericTree } from "@/shared/components/tree/Tree";
import { useCallback, useState } from "react";
import { columns, getItemName, getRowId } from "./ComponentUnitColumns";
import { useDialogs } from "@/shared/hooks/useDialogs";
import {
  tblComponentUnit,
  TypeTblComponentUnit,
} from "@/core/api/generated/api";

export default function PageComponentUnit() {
  const router = useRouter();

  const [selectedRowId, setSelectedRowId] = useState<null | number>(null);
  const [mode, setMode] = useState<"create" | "update">("create");

  const { dialogs, openDialog, closeDialog } = useDialogs({
    upsert: false,
    reportWork: false,
    workShop: false,
    failureReport: false,
  });

  const getAll = useCallback(() => {
    return tblComponentUnit.getAll({
      include: {
        tblCompType: true,
        tblCompStatus: true,
        tblLocation: true,
      },
    });
  }, []);

  const treeMapper = useCallback(
    (items: TypeTblComponentUnit[]) =>
      mapToTree(items, "compId", "parentCompId"),
    [],
  );

  const { rows, tree, loading, refetch, handleDelete } =
    useDataTree<TypeTblComponentUnit>({
      getAll,
      deleteById: tblComponentUnit.deleteById,
      getId: (item) => item.compId,
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

  const handleRowDoubleClick = useCallback(
    (rowId: number) => {
      const row = rows.find((i) => i.compId === rowId);

      if (!row) return;
      router.navigate({
        to: routeComponentUnitDetail.to,
        params: { id: rowId },
        search: { breadcrumb: row?.compNo },
      });
    },
    [router, rows],
  );

  const handleRowClick = ({ row }: { row: TypeTblComponentUnit }) => {
    setSelectedRowId(row.compId);
  };

  const handleRoutineClick = () => {};

  const selectedRow = rows.find((r) => r.compId === selectedRowId) || null;

  return (
    <>
      <Splitter initialPrimarySize="30%">
        <GenericTree<TypeTblComponentUnit>
          label="Tree View"
          loading={loading}
          data={tree}
          onDoubleClick={handleRowDoubleClick}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={handleCreate}
          onRefresh={refetch}
          getItemId={getRowId}
          getItemName={getItemName}
        />
        <CustomizedDataGrid
          showToolbar
          disableRowNumber
          label="List View"
          rows={rows}
          columns={columns}
          loading={loading}
          getRowId={getRowId}
          onEditClick={handleEdit}
          onDeleteClick={handleDelete}
          onDoubleClick={handleRowDoubleClick}
          onAddClick={handleCreate}
          onRowClick={handleRowClick}
          onRefreshClick={refetch}
          toolbarChildren={
            <ComponentUnitActions
              selectedRow={selectedRow}
              onWorkShop={() => openDialog("workShop")}
              onFailureReport={() => openDialog("failureReport")}
              onNoneRoutine={() => openDialog("reportWork")}
              onRoutine={handleRoutineClick}
            />
          }
        />
      </Splitter>

      <ComponentUnitUpsert
        open={dialogs.upsert}
        mode={mode}
        recordId={selectedRowId}
        onClose={() => closeDialog("upsert")}
        onSuccess={refetch}
      />

      <ReportWorkDialog
        open={dialogs.reportWork}
        onClose={() => closeDialog("reportWork")}
        onSuccess={() => closeDialog("reportWork")}
        componentUnitId={selectedRowId ?? undefined}
      />

      <ReportFailureUpsert
        open={dialogs.failureReport}
        mode={"create"}
        compId={selectedRowId!}
        onClose={() => closeDialog("failureReport")}
        onSuccess={() => closeDialog("failureReport")}
      />

      <WorkShopUpsert
        open={dialogs.workShop}
        mode={"create"}
        onClose={() => closeDialog("workShop")}
        onSuccess={() => closeDialog("workShop")}
      />
    </>
  );
}
