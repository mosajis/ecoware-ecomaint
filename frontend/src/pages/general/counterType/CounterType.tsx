import Splitter from "@/shared/components/Splitter";
import CounterTypeFormDialog from "./CounterTypeFormDialog";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import TabContainer from "@/shared/components/TabContainer";
import React, { useState, useCallback } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { dataGridActionColumn } from "@/shared/components/dataGrid/DataGridActionsColumn";
import { useDataGrid } from "../_hooks/useDataGrid";
import { tblCounterType, TypeTblCounterType } from "@/core/api/generated/api";
import TabCompUnitCounter from "./tabs/TabCompUnitCounter";
import TabCompTypeCounter from "./tabs/TabCompTypeCounter";
import TabCompJobCounter from "./tabs/TabCompJobCounter";
import TabCompTypeJobCounter from "./tabs/TabCompTypeJobCounter";

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
  const [selectedCounterType, setSelectedCounterType] =
    useState<TypeTblCounterType | null>(null);

  const getAllCounterTypes = useCallback(() => {
    return tblCounterType.getAll({ paginate: false });
  }, []);

  const {
    rows: counterTypes,
    loading: loadingCounterTypes,
    fetchData: fetchCounterTypes,
    handleDelete: deleteCounterType,
    handleFormSuccess: counterTypeFormSuccess,
  } = useDataGrid(
    getAllCounterTypes,
    tblCounterType.deleteById,
    "counterTypeId"
  );

  // Handlers
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

  return (
    <Splitter initialPrimarySize="25%">
      {/* Left Grid */}
      <CustomizedDataGrid
        rows={counterTypes}
        columns={[
          { field: "name", headerName: "Name", flex: 1 },
          { field: "counterTypeId", headerName: "Id", flex: 1 },
          dataGridActionColumn({
            onEdit: handleEdit,
            onDelete: deleteCounterType,
          }),
        ]}
        loading={loadingCounterTypes}
        label="Counter Type"
        showToolbar
        onAddClick={handleCreate}
        onRefreshClick={fetchCounterTypes}
        getRowId={(row) => row.counterTypeId}
        rowSelection
        onRowClick={(params) => setSelectedCounterType(params.row)}
      />

      {/* Right Grid / Tabs */}
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          {tabList.map((tab) => (
            <Tab key={tab.key} label={tab.label} value={tab.key} />
          ))}
        </Tabs>

        <TabContainer>
          {activeTab === "component" && (
            <TabCompUnitCounter
              label={selectedCounterType?.name}
              counterTypeId={selectedCounterType?.counterTypeId}
            />
          )}

          {activeTab === "compType" && (
            <TabCompTypeCounter
              label={selectedCounterType?.name}
              counterTypeId={selectedCounterType?.counterTypeId}
            />
          )}

          {activeTab === "compJob" && (
            <TabCompJobCounter
              label={selectedCounterType?.name}
              counterTypeId={selectedCounterType?.counterTypeId}
            />
          )}

          {activeTab === "compTypeJob" && (
            <TabCompTypeJobCounter
              label={selectedCounterType?.name}
              counterTypeId={selectedCounterType?.counterTypeId}
            />
          )}
        </TabContainer>
      </Box>

      {/* CounterType Form Dialog */}
      <CounterTypeFormDialog
        open={openForm}
        mode={mode}
        recordId={selectedRowId}
        onClose={() => setOpenForm(false)}
        onSuccess={(record) => {
          counterTypeFormSuccess(record);
          setOpenForm(false);
        }}
      />
    </Splitter>
  );
}
