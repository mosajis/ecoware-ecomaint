import Box from "@mui/material/Box";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";

const TabPerformed = () => {
  const columns = [
    { field: "funcNo", headerName: "Func No", flex: 1 },
    { field: "formDatePersian", headerName: "Form Date (Persian)", flex: 1 },
    { field: "toDatePersian", headerName: "To Date (Persian)", flex: 1 },
    {
      field: "lastUpdatedPersian",
      headerName: "Last Updated (Persian)",
      flex: 1,
    },
    {
      field: "insertUserFullName",
      headerName: "Insert User Full Name",
      flex: 1,
    },
    {
      field: "removedUserFullName",
      headerName: "Removed User Full Name",
      flex: 1,
    },
    { field: "notes", headerName: "Notes", flex: 1 },
  ];

  const rows: any = [];

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
