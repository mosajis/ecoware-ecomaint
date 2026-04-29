import MaintClassUpsert from "./MaintClassUpsert.js";
import MaintTypeUpsert from "./MaintTypeUpsert.js";
import MaintCauseUpsert from "./MaintCauseUpsert.js";
import Splitter from "@/shared/components/Splitter/Splitter.js";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useDialogs } from "@/shared/hooks/useDialogs.js";
import { useState, useCallback } from "react";
import { useDataGrid } from "@/shared/hooks/useDataGrid.js";
import {
  tblMaintType,
  tblMaintClass,
  tblMaintCause,
} from "@/core/api/generated/api";
import {
  columns,
  getRowIdCause,
  getRowIdClass,
  getRowIdType,
} from "./MaintColumns.js";

export default function PageMaintClass() {
  const { dialogs, openDialog, closeDialog } = useDialogs({
    upsertType: false,
    upsertCause: false,
    upsertClass: false,
  });
  // ---------------- Maint Type ----------------
  const {
    rows: typeRows,
    loading: loadingType,
    handleDelete: handleDeleteType,
    handleRefresh: refreshType,
  } = useDataGrid(tblMaintType.getAll, tblMaintType.deleteById, "maintTypeId");

  const [modeType, setModeType] = useState<"create" | "update">("create");
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);

  const openUpsertMaintType = useCallback(
    (mode: "create" | "update" = "create", id?: number) => {
      setModeType(mode);
      setSelectedTypeId(id ?? null);
      openDialog("upsertType");
    },
    [],
  );

  // ---------------- Maint Class ----------------
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

  const [modeClass, setModeClass] = useState<"create" | "update">("create");
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);

  const openUpsertMaintClass = useCallback(
    (mode: "create" | "update" = "create", id?: number) => {
      setModeClass(mode);
      setSelectedClassId(id ?? null);
      openDialog("upsertClass");
    },
    [],
  );

  // ---------------- Maint Cause ----------------

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

  const [modeCause, setModeCause] = useState<"create" | "update">("create");
  const [selectedCauseId, setSelectedCauseId] = useState<number | null>(null);

  const openUpsertMaintCause = useCallback(
    (mode: "create" | "update" = "create", id?: number) => {
      setModeCause(mode);
      setSelectedCauseId(id ?? null);
      openDialog("upsertCause");
    },
    [],
  );

  return (
    <>
      <Splitter initialPrimarySize="34%">
        <CustomizedDataGrid
          showToolbar
          disableColumns
          disableExport
          disableRefresh
          elementId={600}
          label="Maint Class"
          rows={classRows}
          columns={columns}
          loading={loadingClass}
          onEditClick={(rowId) => openUpsertMaintClass("update", rowId)}
          onDoubleClick={(rowId) => openUpsertMaintClass("update", rowId)}
          onAddClick={() => openUpsertMaintClass()}
          onDeleteClick={handleDeleteClass}
          onRefreshClick={refreshClass}
          getRowId={getRowIdClass}
        />

        <Splitter initialPrimarySize="50%">
          <CustomizedDataGrid
            showToolbar
            disableColumns
            disableExport
            disableRefresh
            label="Maint Type"
            elementId={620}
            rows={typeRows}
            columns={columns}
            loading={loadingType}
            onEditClick={(rowId) => openUpsertMaintType("update", rowId)}
            onDoubleClick={(rowId) => openUpsertMaintType("update", rowId)}
            onAddClick={() => openUpsertMaintType()}
            onDeleteClick={handleDeleteType}
            onRefreshClick={refreshType}
            getRowId={getRowIdType}
          />

          <CustomizedDataGrid
            showToolbar
            disableColumns
            disableExport
            disableRefresh
            label="Maint Cause"
            elementId={610}
            rows={causeRows}
            columns={columns}
            loading={loadingCause}
            onEditClick={(rowId) => openUpsertMaintCause("update", rowId)}
            onDoubleClick={(rowId) => openUpsertMaintCause("update", rowId)}
            onAddClick={() => openUpsertMaintCause()}
            onDeleteClick={handleDeleteCause}
            onRefreshClick={refreshCause}
            getRowId={getRowIdCause}
          />
        </Splitter>
      </Splitter>

      <MaintTypeUpsert
        open={dialogs.upsertType}
        mode={modeType}
        recordId={selectedTypeId}
        onClose={() => closeDialog("upsertType")}
        onSuccess={refreshType}
      />

      <MaintClassUpsert
        open={dialogs.upsertClass}
        mode={modeClass}
        recordId={selectedClassId}
        onClose={() => closeDialog("upsertClass")}
        onSuccess={refreshClass}
      />

      <MaintCauseUpsert
        open={dialogs.upsertCause}
        mode={modeCause}
        recordId={selectedCauseId}
        onClose={() => closeDialog("upsertCause")}
        onSuccess={refreshCause}
      />
    </>
  );
}
