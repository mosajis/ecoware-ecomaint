import React from "react";
import {Box} from "@mui/material";
import CustomizedDataGrid from "@/shared/components/DataGrid"; // مسیرت رو درست کن

const TabPerformed = () => {
  const columns = [
    { field: "funcNo", headerName: "Func No", flex: 1 },
    { field: "formDatePersian", headerName: "Form Date (Persian)", flex: 1 },
    { field: "toDatePersian", headerName: "To Date (Persian)", flex: 1 },
    { field: "lastUpdatedPersian", headerName: "Last Updated (Persian)", flex: 1 },
    { field: "insertUserFullName", headerName: "Insert User Full Name", flex: 1 },
    { field: "removedUserFullName", headerName: "Removed User Full Name", flex: 1 },
    { field: "notes", headerName: "Notes", flex: 1 },
  ];

  const rows = [
    {
      id: "1",
      funcNo: "F001",
      formDatePersian: "1404-07-01",
      toDatePersian: "1404-07-30",
      lastUpdatedPersian: "1404-08-01",
      insertUserFullName: "Ali Rezaei",
      removedUserFullName: "Sara Ahmadi",
      notes: "Routine maintenance performed.",
    },
  ];

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <CustomizedDataGrid
        style={{ flex: 1 }}
        label="Performed Maintenance"
        rows={rows}
        columns={columns}
      />
    </Box>
  );
};

export default TabPerformed;
