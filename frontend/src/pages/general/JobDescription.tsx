import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Splitter from "@/shared/components/Splitter";
import AppEditor from "@/shared/components/Editor";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useCallback, useMemo, useState } from "react";
import { Box, Tabs, Tab, Typography } from "@mui/material";
import TabContainer from "@/shared/components/TabContainer";
import { dataGridActionColumn } from "@/shared/components/dataGrid/DataGridActionsColumn";
import {
  tblJobDescription,
  TypeTblJobDescription,
} from "@/core/api/generated/api";
import { useDataGrid } from "./_hooks/useDataGrid";

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
  const { rows, loading, fetchData, handleDelete, handleFormSuccess } =
    useDataGrid(getAll, tblJobDescription.deleteById, "jobDescId");

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
      { field: "jobDescTitle", headerName: "JobDescTitle", flex: 1 },
      {
        field: "jobClass",
        headerName: "JobClass",
        flex: 1,
        valueGetter: (i, row) => row?.tblJobClass?.name,
      },
      { field: "changeReason", headerName: "ChangeReason", flex: 1 },
      dataGridActionColumn({ onEdit: handleEdit, onDelete: handleDelete }),
    ],
    [handleEdit, handleDelete]
  );

  function onChange(e: any) {
    setHtml(e.target.value);
  }

  return (
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
          asd
        </TabPanel>
      </Box>

      <Splitter
        horizontal={false} // تقسیم افقی (چپ/راست)
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
        <AppEditor value={html} onChange={onChange} />
      </Splitter>
    </Splitter>
  );
}
