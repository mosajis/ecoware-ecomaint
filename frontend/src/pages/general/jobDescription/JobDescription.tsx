import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Splitter from "@/shared/components/Splitter";
import AppEditor from "@/shared/components/Editor";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useCallback, useMemo, useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import TabContainer from "@/shared/components/TabContainer";
import { dataGridActionColumn } from "@/shared/components/dataGrid/DataGridActionsColumn";
import {
  tblJobDescription,
  TypeTblJobDescription,
} from "@/core/api/generated/api";
import { useDataGrid } from "../_hooks/useDataGrid";

import TabMaintLog from "./tabs/TabMaintLog";
import TabAttachment from "./tabs/TabAttachment";
import TabComponentUnit from "./tabs/TabComponentUnit";
import TabTriggers from "./tabs/TabTriggers";
import TabRevision from "./tabs/TabRevision";

import JobDescriptionFormDialog from "./JobDescriptionFormDialog";

function TabPanel({ children, value, index }: any) {
  return value === index ? <TabContainer>{children}</TabContainer> : null;
}

export default function JobDescription() {
  const [tabIndex, setTabIndex] = useState(0);
  const [html, setHtml] = useState("");
  const [selectedRowId, setSelectedRowId] = useState<null | number>(null);
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");

  const getAll = useCallback(() => {
    return tblJobDescription.getAll({
      paginate: true,
      include: {
        tblJobClass: true,
      },
    });
  }, []);

  // === useDataGrid ===
  const { rows, loading, fetchData, handleDelete } = useDataGrid(
    getAll,
    tblJobDescription.deleteById,
    "jobDescId"
  );

  // === Handlers ===
  const handleCreate = useCallback(() => {
    setSelectedRowId(null);
    setMode("create");
    setOpenForm(true);
  }, []);

  const handleEdit = useCallback((row: TypeTblJobDescription) => {
    setSelectedRowId(row.jobDescId);
    setMode("update");
    setOpenForm(true);
  }, []);

  // === Columns ===
  const columns = useMemo<GridColDef<TypeTblJobDescription>[]>(
    () => [
      { field: "jobDescCode", headerName: "JobDescCode", width: 120 },
      { field: "jobDesc", headerName: "JobDesc", flex: 1 },
      {
        field: "jobClass",
        headerName: "JobClass",
        flex: 1,
        valueGetter: (value, row) => row?.tblJobClass?.name,
      },
      { field: "changeReason", headerName: "ChangeReason", flex: 1 },
      dataGridActionColumn({ onEdit: handleEdit, onDelete: handleDelete }),
    ],
    [handleEdit, handleDelete]
  );

  return (
    <>
      <Splitter
        horizontal={true}
        initialPrimarySize="50%"
        resetOnDoubleClick
        minPrimarySize="20%"
        minSecondarySize="20%"
      >
        {/* === Upper Box: Tabs === */}
        <Box height="100%">
          <Tabs
            value={tabIndex}
            onChange={(_, v) => setTabIndex(v)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="MaintLog" />
            <Tab label="Attachment" />
            <Tab label="Component Unit" />
            <Tab label="Triggers" />
            <Tab label="Revision" />
          </Tabs>

          <TabPanel value={tabIndex} index={0}>
            <TabMaintLog />
          </TabPanel>
          <TabPanel value={tabIndex} index={1}>
            <TabAttachment />
          </TabPanel>
          <TabPanel value={tabIndex} index={2}>
            <TabComponentUnit />
          </TabPanel>
          <TabPanel value={tabIndex} index={3}>
            <TabTriggers />
          </TabPanel>
          <TabPanel value={tabIndex} index={4}>
            <TabRevision />
          </TabPanel>
        </Box>

        {/* === Lower section: Grid + Editor === */}
        <Splitter
          horizontal={false}
          initialPrimarySize="65%"
          resetOnDoubleClick
          minPrimarySize="30%"
          minSecondarySize="25%"
        >
          <CustomizedDataGrid
            label="Job Description"
            getRowId={(row) => row.jobDescId}
            loading={loading}
            onAddClick={handleCreate}
            rows={rows}
            columns={columns}
            showToolbar
          />

          <AppEditor value={html} onChange={(e) => setHtml(e.target.value)} />
        </Splitter>

        {/* === Insert FormDialog here === */}
      </Splitter>

      <JobDescriptionFormDialog
        open={openForm}
        mode={mode}
        recordId={selectedRowId}
        onClose={() => setOpenForm(false)}
        onSuccess={() => {
          fetchData();
          setOpenForm(false);
        }}
      />
    </>
  );
}
