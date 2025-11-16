import { useState, useCallback, useMemo } from "react";
import { Box } from "@mui/material";
import Splitter from "@/shared/components/Splitter";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { dataGridActionColumn } from "@/shared/components/dataGrid/DataGridActionsColumn";
import { GridColDef } from "@mui/x-data-grid";
import {
  tblMaintType,
  tblMaintClass,
  tblMaintCause,
  TypeTblMaintCause,
  TypeTblMaintType,
  TypeTblMaintClass,
} from "@/core/api/generated/api";
import { useDataGrid } from "../_hooks/useDataGrid.js";
import MaintClassFormDialog from "./MaintClassFormDialog.js";
import MaintTypeFormDialog from "./MaintTypeFormDialog.js";
import MaintCauseFormDialog from "./MaintCauseFormDialog.js";

export default function MaintPage() {
  // ---------------- Maint Type ----------------
  const getIdType = useCallback((row: any) => row.maintTypeId, []);
  const {
    rows: typeRows,
    loading: loadingType,
    handleDelete: handleDeleteType,
    handleFormSuccess: handleTypeSuccess,
    handleRefresh: refreshType,
  } = useDataGrid(tblMaintType, getIdType);

  const typeColumns: GridColDef<TypeTblMaintType>[] = [
    { field: "descr", headerName: "Description", flex: 1 },
    dataGridActionColumn({
      onEdit: (row) => openTypeForm("update", row.maintTypeId),
      onDelete: handleDeleteType,
    }),
  ];

  const [openType, setOpenType] = useState(false);
  const [modeType, setModeType] = useState<"create" | "update">("create");
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);

  const openTypeForm = useCallback((mode: "create" | "update", id?: number) => {
    setModeType(mode);
    setSelectedTypeId(id ?? null);
    setOpenType(true);
  }, []);

  // ---------------- Maint Class ----------------
  const getIdClass = useCallback((row: any) => row.maintClassId, []);
  const {
    rows: classRows,
    loading: loadingClass,
    handleDelete: handleDeleteClass,
    handleFormSuccess: handleClassSuccess,
    handleRefresh: refreshClass,
  } = useDataGrid(tblMaintClass, getIdClass);

  const classColumns: GridColDef<TypeTblMaintClass>[] = [
    { field: "descr", headerName: "Description", flex: 1 },
    dataGridActionColumn({
      onEdit: (row) => openClassForm("update", row.maintClassId),
      onDelete: handleDeleteClass,
    }),
  ];

  const [openClass, setOpenClass] = useState(false);
  const [modeClass, setModeClass] = useState<"create" | "update">("create");
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);

  const openClassForm = useCallback(
    (mode: "create" | "update", id?: number) => {
      setModeClass(mode);
      setSelectedClassId(id ?? null);
      setOpenClass(true);
    },
    []
  );

  // ---------------- Maint Cause ----------------
  const getIdCause = useCallback((row: any) => row.maintCauseId, []);
  const {
    rows: causeRows,
    loading: loadingCause,
    handleDelete: handleDeleteCause,
    handleFormSuccess: handleCauseSuccess,
    handleRefresh: refreshCause,
  } = useDataGrid(tblMaintCause, getIdCause);

  const causeColumns: GridColDef<TypeTblMaintCause>[] = [
    { field: "descr", headerName: "Description", flex: 1 },
    dataGridActionColumn({
      onEdit: (row) => openCauseForm("update", row.maintCauseId),
      onDelete: handleDeleteCause,
    }),
  ];

  const [openCause, setOpenCause] = useState(false);
  const [modeCause, setModeCause] = useState<"create" | "update">("create");
  const [selectedCauseId, setSelectedCauseId] = useState<number | null>(null);

  const openCauseForm = useCallback(
    (mode: "create" | "update", id?: number) => {
      setModeCause(mode);
      setSelectedCauseId(id ?? null);
      setOpenCause(true);
    },
    []
  );

  return (
    <Box height="100%" display="flex" flexDirection="column">
      <Splitter initialPrimarySize="34%">
        {/* Panel 1 - Maint Type */}
        <CustomizedDataGrid
          label="Maint Type"
          showToolbar
          rows={typeRows}
          columns={typeColumns}
          loading={loadingType}
          onAddClick={() => openTypeForm("create")}
          onRefreshClick={refreshType}
          getRowId={getIdType}
        />

        {/* Panel 2 contains Splitter for Class + Cause */}
        <Splitter initialPrimarySize="50%">
          {/* Panel 2.1 - Maint Class */}
          <CustomizedDataGrid
            label="Maint Class"
            showToolbar
            rows={classRows}
            columns={classColumns}
            loading={loadingClass}
            onAddClick={() => openClassForm("create")}
            onRefreshClick={refreshClass}
            getRowId={getIdClass}
          />

          {/* Panel 2.2 - Maint Cause */}
          <CustomizedDataGrid
            label="Maint Cause"
            showToolbar
            rows={causeRows}
            columns={causeColumns}
            loading={loadingCause}
            onAddClick={() => openCauseForm("create")}
            onRefreshClick={refreshCause}
            getRowId={getIdCause}
          />
        </Splitter>
      </Splitter>

      {/* ---------------- Form Dialogs ---------------- */}
      <MaintTypeFormDialog
        open={openType}
        mode={modeType}
        recordId={selectedTypeId}
        onClose={() => setOpenType(false)}
        onSuccess={handleTypeSuccess}
      />

      <MaintClassFormDialog
        open={openClass}
        mode={modeClass}
        recordId={selectedClassId}
        onClose={() => setOpenClass(false)}
        onSuccess={handleClassSuccess}
      />

      <MaintCauseFormDialog
        open={openCause}
        mode={modeCause}
        recordId={selectedCauseId}
        onClose={() => setOpenCause(false)}
        onSuccess={handleCauseSuccess}
      />
    </Box>
  );
}
