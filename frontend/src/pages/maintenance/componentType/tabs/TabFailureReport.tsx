import Box from "@mui/material/Box";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid"; // مسیرت رو درست کن

const TabFailureReport = () => {
  const columns = [
    { field: "number", headerName: "Number", flex: 1 },
    { field: "componentNo", headerName: "Component No", flex: 1 },
    { field: "failureDate", headerName: "Failure Date", flex: 1 },
    { field: "titleTotalWait", headerName: "Title Total Wait", flex: 1 },
    { field: "discName", headerName: "Disc. Name", flex: 1 },
    { field: "lastUpdated", headerName: "Last Updated", flex: 1 },
    { field: "loggedBy", headerName: "Logged By", flex: 1 },
    { field: "approvedBy", headerName: "Approved By", flex: 1 },
    { field: "closedBy", headerName: "Closed By", flex: 1 },
    { field: "closeDate", headerName: "Close Date", flex: 1 },
  ];

  const rows = [
    {
      id: "1",
      number: 1,
      componentNo: "C001",
      failureDate: "2025-10-15",
      titleTotalWait: "5 hours",
      discName: "Mechanical",
      lastUpdated: "2025-10-20",
      loggedBy: "John Doe",
      approvedBy: "Jane Smith",
      closedBy: "Manager A",
      closeDate: "2025-10-25",
    },
  ];

  return (
    <Box display="flex" flexDirection="column" height="100%">
      {/* DataGrid */}
      <CustomizedDataGrid
        style={{ flex: 1 }}
        label="Failure Report"
        rows={rows}
        columns={columns}
      />
    </Box>
  );
};

export default TabFailureReport;
