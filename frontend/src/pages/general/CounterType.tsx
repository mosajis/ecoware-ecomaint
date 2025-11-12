import React, { useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import Splitter from "@/shared/components/Splitter";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";

// داده نمونه
const leftRows = [
  { id: 1, name: "Item 1" },
  { id: 2, name: "Item 2" },
];

const tabData = {
  component: [
    { id: 1, TblabelType: "Type A", RelatedID: 101, RelatedName: "Rel 1" },
    { id: 2, TblabelType: "Type B", RelatedID: 102, RelatedName: "Rel 2" },
  ],
  compType: [
    { id: 1, TblabelType: "Type C", RelatedID: 201, RelatedName: "Rel 3" },
  ],
  compJob: [
    { id: 1, TblabelType: "Type D", RelatedID: 301, RelatedName: "Rel 4" },
  ],
  compTypeJob: [
    { id: 1, TblabelType: "Type E", RelatedID: 401, RelatedName: "Rel 5" },
  ],
};

const tabList = [
  { label: "Component", key: "component" },
  { label: "CompType", key: "compType" },
  { label: "CompJob", key: "compJob" },
  { label: "CompTypeJob", key: "compTypeJob" },
];

export default function CounterTypePage() {
  const [activeTab, setActiveTab] = useState("component");

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  return (
    <Splitter initialPrimarySize="25%">
      {/* Left Table */}
      <CustomizedDataGrid
        rows={leftRows}
        columns={[{ field: "name", headerName: "Name", flex: 1 }]}
      />

      {/* Right Tabs */}
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

        <Box p={".5rem"}>
          <CustomizedDataGrid
            rows={[]}
            columns={[
              { field: "TblabelType", headerName: "TblabelType", flex: 1 },
              { field: "RelatedID", headerName: "RelatedID", flex: 1 },
              { field: "RelatedName", headerName: "RelatedName", flex: 1 },
            ]}
          />
        </Box>
      </Box>
    </Splitter>
  );
}
