import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import Splitter from "@/shared/components/Splitter/Splitter";
import AttachmentMap from "@/shared/tabs/attachmentMap/AttachmentMap";
import WorkShopUpsert from "./WorkShopUpsert";
import WorkShopActions from "./WorkShopActions";
import WorkShopDialogComplete from "./WorkShopDialogClose";
import WorkShopDialogOpen from "./WorkShopDialogOpen";
import WorkShopDialogFilter, { WorkShopFilter } from "./WorkShopDialogFilter";
import WorkShopDialogPrint from "./WorkShopDialogPrint";
import { useCallback, useMemo, useState } from "react";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { columns, getRowId } from "./WorkShopColumns";
import {
  tblWorkShop,
  tblWorkShopAttachment,
  TypeTblWorkShop,
} from "@/core/api/generated/api";

export default function PageWorkShop() {
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [filter, setFilter] = useState<WorkShopFilter | null>(null);

  const [dialogs, setDialogs] = useState({
    upsert: false,
    open: false,
    filter: true,
    close: false,
    print: false,
  });

  const getAll = useCallback(
    () =>
      tblWorkShop.getAll({
        filter: filter ?? undefined,
        include: {
          tblDiscipline: true,
          tblEmployeeTblWorkShopPersonInChargeIdTotblEmployee: true,
          tblEmployeeTblWorkShopPersonInChargeApproveIdTotblEmployee: true,
          tblEmployeeTblWorkShopClosedByIdTotblEmployee: true
        },
      }),
    [filter],
  );

  const { rows, loading, handleRefresh, handleDelete } = useDataGrid(
    getAll,
    tblWorkShop.deleteById,
    "workShopId",
    !dialogs.filter
  );

  const selectedRow = rows.find((r) => r.workShopId === selectedRowId) || null;

  const openDialog = (key: keyof typeof dialogs) =>
    setDialogs((p) => ({ ...p, [key]: true }));

  const closeDialog = (key: keyof typeof dialogs) =>
    setDialogs((p) => ({ ...p, [key]: false }));

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

  const handleRowClick = useCallback(
    ({ row }: { row: TypeTblWorkShop }) => {
      if (row.workShopId === selectedRowId) {
        setSelectedRowId(null);
        setSelectedLabel(null);
        return;
      }
      setSelectedRowId(row.workShopId);
      setSelectedLabel(row.workShopNo ?? null);
    },
    [selectedRowId],
  );

  const handleFilterSubmit = (newFilter: WorkShopFilter | null) => {
    setFilter(newFilter);
    closeDialog("filter");
  };

  const toolbar = useMemo(
    () => (
      <WorkShopActions
        selectedRow={selectedRow}
        onFilter={() => openDialog("filter")}
        onOpen={() => openDialog("open")}
        onClose={() => openDialog("close")}
        onPrint={() => openDialog("print")}
      />
    ),
    [selectedRow],
  );

  const handleSuccessUpsert = () => {
    closeDialog("upsert");
    handleRefresh();
  };

  return (
    <>
      <Splitter horizontal initialPrimarySize="65%">
        <CustomizedDataGrid
          showToolbar
          disableRowNumber
          label="WorkShop"
          elementId={1360}
          loading={loading}
          rows={rows}
          columns={columns}
          getRowId={getRowId}
          onRefreshClick={handleRefresh}
          onAddClick={handleCreate}
          onEditClick={handleEdit}
          onDoubleClick={handleEdit}
          onDeleteClick={handleDelete}
          onRowClick={handleRowClick}
          toolbarChildren={toolbar}
        />
        <AttachmentMap
          label={selectedLabel || "WorkShop Attachments"}
          mapService={tblWorkShopAttachment}
          filterId={selectedRowId}
          filterKey="workShopId"
          relName="tblWorkShop"
          tableId="workShopAttachmentId"
        />
      </Splitter>

      <WorkShopUpsert
        open={dialogs.upsert}
        mode={mode}
        workShopId={selectedRowId}
        onClose={() => closeDialog("upsert")}
        onSuccess={handleSuccessUpsert}
      />

      <WorkShopDialogComplete
        open={dialogs.close}
        workShopId={selectedRowId}
        onClose={() => closeDialog("close")}
        onSuccess={handleRefresh}
      />

      <WorkShopDialogOpen
        open={dialogs.open}
        workShopId={selectedRowId}
        onClose={() => closeDialog("open")}
        onSuccess={handleRefresh}
      />

      <WorkShopDialogFilter
        open={dialogs.filter}
        onClose={() => closeDialog("filter")}
        onSubmit={handleFilterSubmit}
      />

      <WorkShopDialogPrint
        workShopId={selectedRowId!}
        onClose={() => closeDialog("print")}
        open={dialogs.print}
      />
    </>
  );
}
