import React from "react";
import CustomizedDataGrid from "@/shared/components/DataGrid";

const TabMaterialRequests = () => {
  const columns = [
    { field: "materialDocNo", headerName: "Material Doc No", flex: 1 },
    { field: "requestDate", headerName: "Request Date", flex: 1 },
    { field: "items", headerName: "Items", flex: 1 },
    { field: "comment", headerName: "Comment", flex: 1 },
    { field: "compNo", headerName: "Comp No", flex: 1 },
    { field: "discipline", headerName: "Discipline", flex: 1 },
    { field: "personInCharge", headerName: "Person in Charge", flex: 1 },
    { field: "pmEngineer", headerName: "PM Engineer", flex: 1 },
    { field: "rigMaster", headerName: "Rig Master", flex: 1 },
    { field: "supervisor", headerName: "Supervisor (Kish/Office)", flex: 1 },
    { field: "manager", headerName: "Manager (Kish/Office)", flex: 1 },
    { field: "state", headerName: "State", flex: 1 },
    { field: "requestNo", headerName: "Request No", flex: 1 },
    { field: "followNo", headerName: "Follow No", flex: 1 },
    { field: "lastUpdated", headerName: "Last Updated", flex: 1 },
  ];

  const rows = [
    {
      id: "1", // مهم برای DataGrid
      materialDocNo: "MD001",
      requestDate: "2025-11-01",
      items: "Item A, Item B",
      comment: "Urgent request",
      compNo: "C001",
      discipline: "Mechanical",
      personInCharge: "John Doe",
      pmEngineer: "Jane Smith",
      rigMaster: "Rig Master A",
      supervisor: "Supervisor A",
      manager: "Manager A",
      state: "Open",
      requestNo: "REQ123",
      followNo: "FOL456",
      lastUpdated: "2025-11-02",
    },
  ];

  return (
    <CustomizedDataGrid label={"Material Requests"} rows={rows} columns={columns} />
  );
};

export default TabMaterialRequests;
