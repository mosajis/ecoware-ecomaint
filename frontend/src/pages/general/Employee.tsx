import * as React from "react";
import { Box } from "@mui/material";
import Splitter from "@/shared/components/Splitter";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";

export default function EmployeeDiscipline() {
  const employeeColumns = [
    { field: "code", headerName: "Code", width: 100 },
    { field: "lastName", headerName: "Last Name", width: 140 },
    { field: "firstName", headerName: "First Name", width: 140 },
    { field: "addressCode", headerName: "Address Code", width: 140 },
    { field: "addressName", headerName: "Address Name", width: 160 },
    { field: "discipline", headerName: "Discipline", width: 140 },
    { field: "position", headerName: "Position", width: 140 },
    { field: "availability", headerName: "Mrs.Avail./Week", width: 160 },
  ];

  const employeeRows = [
    {
      id: 1,
      code: "EMP001",
      lastName: "Karimi",
      firstName: "Ali",
      addressCode: "A-01",
      addressName: "Tehran Office",
      discipline: "Warning",
      position: "Manager",
      availability: "5",
    },
    {
      id: 2,
      code: "EMP002",
      lastName: "Sadeghi",
      firstName: "Sara",
      addressCode: "A-02",
      addressName: "Shiraz Office",
      discipline: "None",
      position: "HR",
      availability: "6",
    },
  ];

  return (
    <CustomizedDataGrid
      label="Employee "
      showToolbar
      rows={employeeRows}
      columns={employeeColumns}
      onAddClick={() => console.log("Add employee")}
      onRefreshClick={() => console.log("Refresh employee list")}
    />
  );
}
