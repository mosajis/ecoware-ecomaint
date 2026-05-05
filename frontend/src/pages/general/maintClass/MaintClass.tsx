import Splitter from "@/shared/components/Splitter/Splitter";
import DataGrid from "@/shared/components/dataGrid/DataGrid";
import MaintClassUpsert from "./MaintClassUpsert";
import MaintTypeUpsert from "./MaintTypeUpsert";
import MaintCauseUpsert from "./MaintCauseUpsert";

import {
  tblMaintType,
  tblMaintClass,
  tblMaintCause,
} from "@/core/api/generated/api";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { useUpsertDialog } from "@/shared/hooks/useUpsertDialog";
import {
  columns,
  getRowIdCause,
  getRowIdClass,
  getRowIdType,
} from "./MaintColumns";

export default function PageMaintClass() {
  // === Maint Type ===
  const {
    rows: typeRows,
    loading: loadingType,
    handleDelete: handleDeleteType,
    handleRefresh: refreshType,
  } = useDataGrid(tblMaintType.getAll, tblMaintType.deleteById, "maintTypeId");

  const typeDialog = useUpsertDialog({
    onSuccess: refreshType,
  });

  // === Maint Class ===
  const {
    rows: classRows,
    loading: loadingClass,
    handleDelete: handleDeleteClass,
    handleRefresh: refreshClass,
  } = useDataGrid(
    tblMaintClass.getAll,
    tblMaintClass.deleteById,
    "maintClassId",
  );

  const classDialog = useUpsertDialog({
    onSuccess: refreshClass,
  });

  // === Maint Cause ===
  const {
    rows: causeRows,
    loading: loadingCause,
    handleDelete: handleDeleteCause,
    handleRefresh: refreshCause,
  } = useDataGrid(
    tblMaintCause.getAll,
    tblMaintCause.deleteById,
    "maintCauseId",
  );

  const causeDialog = useUpsertDialog({
    onSuccess: refreshCause,
  });

  return (
    <Splitter initialPrimarySize="34%">
      {/* CLASS */}
      <DataGrid
        showToolbar
        disableColumns
        disableExport
        elementId={630}
        label="Maint Class"
        rows={classRows}
        columns={columns}
        loading={loadingClass}
        onAddClick={classDialog.openCreate}
        onEditClick={classDialog.openEdit}
        onDeleteClick={handleDeleteClass}
        onRefreshClick={refreshClass}
        onDoubleClick={classDialog.openView}
        getRowId={getRowIdClass}
      >
        <MaintClassUpsert
          entityName="Maint Class"
          {...classDialog.dialogProps}
        />
      </DataGrid>

      <Splitter initialPrimarySize="50%">
        {/* TYPE */}
        <DataGrid
          showToolbar
          disableColumns
          disableExport
          label="Maint Type"
          elementId={620}
          rows={typeRows}
          columns={columns}
          loading={loadingType}
          onAddClick={typeDialog.openCreate}
          onEditClick={typeDialog.openEdit}
          onDeleteClick={handleDeleteType}
          onRefreshClick={refreshType}
          onDoubleClick={typeDialog.openView}
          getRowId={getRowIdType}
        >
          <MaintTypeUpsert
            entityName="Maint Type"
            {...typeDialog.dialogProps}
          />
        </DataGrid>

        {/* CAUSE */}
        <DataGrid
          showToolbar
          disableColumns
          disableExport
          label="Maint Cause"
          elementId={610}
          rows={causeRows}
          columns={columns}
          loading={loadingCause}
          onAddClick={causeDialog.openCreate}
          onEditClick={causeDialog.openEdit}
          onDeleteClick={handleDeleteCause}
          onRefreshClick={refreshCause}
          onDoubleClick={causeDialog.openView}
          getRowId={getRowIdCause}
        >
          <MaintCauseUpsert
            entityName="Maint Cause"
            {...causeDialog.dialogProps}
          />
        </DataGrid>
      </Splitter>
    </Splitter>
  );
}
