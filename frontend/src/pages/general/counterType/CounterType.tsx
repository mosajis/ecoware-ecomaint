import React, { useState, useCallback } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import Splitter from "@/shared/components/Splitter";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import CounterTypeFormDialog from "./CounterTypeFormDialog"; // فرم CRUD
import { tblCounterType, TypeTblCounterType } from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";
import { dataGridActionColumn } from "@/shared/components/dataGrid/DataGridActionsColumn";
import { useDataGrid } from "../_hooks/useDataGrid";
import TabContainer from "@/shared/components/TabContainer";

const tabList = [
  { label: "Component", key: "component" },
  { label: "CompType", key: "compType" },
  { label: "CompJob", key: "compJob" },
  { label: "CompTypeJob", key: "compTypeJob" },
];

export default function CounterTypePage() {
  const [activeTab, setActiveTab] = useState("component");
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  // === useDataGrid برای سمت راست (DataGrid تب فعال) ===
  const { rows, loading, fetchData, handleDelete, handleFormSuccess } =
    useDataGrid<TypeTblCounterType, number>(
      tblCounterType,
      (x) => x.counterTypeId
    );

  // === Handlers فرم ===
  const handleCreate = useCallback(() => {
    setSelectedRowId(null);
    setMode("create");
    setOpenForm(true);
  }, []);

  const handleEdit = useCallback((row: TypeTblCounterType) => {
    setSelectedRowId(row.counterTypeId);
    setMode("update");
    setOpenForm(true);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  // === ستون‌ها ===
  const columns: GridColDef<TypeTblCounterType>[] = [
    { field: "name", headerName: "Name", flex: 1 },
    dataGridActionColumn({ onEdit: handleEdit, onDelete: handleDelete }),
  ];

  return (
    <Splitter initialPrimarySize="25%">
      {/* Left Table ثابت */}
      <CustomizedDataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        label={`Counter Type`}
        showToolbar
        onAddClick={handleCreate}
        onRefreshClick={fetchData}
        getRowId={(row) => row.counterTypeId}
      />

      {/* Right Table با تب‌ها */}
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabList.map((tab) => (
            <Tab key={tab.key} label={tab.label} value={tab.key} />
          ))}
        </Tabs>

        <TabContainer>asd</TabContainer>
      </Box>

      <CounterTypeFormDialog
        open={openForm}
        mode={mode}
        recordId={selectedRowId}
        onClose={() => setOpenForm(false)}
        onSuccess={(record) => {
          handleFormSuccess(record);
          setOpenForm(false);
        }}
      />
    </Splitter>
  );
}
