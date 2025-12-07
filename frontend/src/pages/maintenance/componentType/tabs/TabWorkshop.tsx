import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid"; // مسیرت رو درست کن

const TabWorkshop = () => {
  const columnsTable1 = [
    { field: "components", headerName: "Components", flex: 1 },
    { field: "location", headerName: "Location", flex: 1 },
    { field: "awardingDate", headerName: "Awarding Date", flex: 1 },
    { field: "jobOrderNo", headerName: "Job Order No", flex: 1 },
    { field: "department", headerName: "Department", flex: 1 },
    { field: "personInCharge", headerName: "Person in Charge", flex: 1 },
    { field: "pmEngineer", headerName: "PM Engineer", flex: 1 },
    { field: "bargeMaster", headerName: "Barge Master", flex: 1 },
    { field: "rigMaster", headerName: "Rig Master", flex: 1 },
    { field: "f54", headerName: "F54", flex: 1 },
  ];

  const dataTable1 = [
    {
      id: "1",
      components: "Component A",
      location: "Location 1",
      awardingDate: "2025-10-01",
      jobOrderNo: "JO123",
      department: "Mechanical",
      personInCharge: "John Doe",
      pmEngineer: "Jane Smith",
      bargeMaster: "Barge Master A",
      rigMaster: "Rig Master A",
      f54: "F54 Value",
    },
  ];

  const columnsTable2 = [
    { field: "awardingDate", headerName: "Awarding Date", flex: 1 },
    { field: "completedDate", headerName: "Completed Date", flex: 1 },
    { field: "personInCharge", headerName: "Person in Charge", flex: 1 },
    { field: "pmEngineer", headerName: "PM Engineer", flex: 1 },
    { field: "bargeMaster", headerName: "Barge Master", flex: 1 },
    { field: "rigMaster", headerName: "Rig Master", flex: 1 },
    {
      field: "personInChargeOnRig",
      headerName: "Person in Charge on Rig",
      flex: 1,
    },
  ];

  const dataTable2 = [
    {
      id: "1",
      awardingDate: "2025-10-01",
      completedDate: "2025-10-15",
      personInCharge: "John Doe",
      pmEngineer: "Jane Smith",
      bargeMaster: "Barge Master A",
      rigMaster: "Rig Master A",
      personInChargeOnRig: "Rig Person A",
    },
  ];

  return (
    <Box display="flex" flexDirection="column" height="100%" gap={10}>
      {/* Table 1 */}
      <Box>
        <Stack direction="row" spacing={1} mb={1} flexWrap="wrap">
          {["New", "Edit", "View", "Delete", "Print", "Export"].map((label) => (
            <Button
              key={label}
              variant={label === "New" ? "contained" : "outlined"}
              size="small"
            >
              {label}
            </Button>
          ))}
        </Stack>
        <CustomizedDataGrid
          style={{ flex: 1, minHeight: 300 }}
          label="Components Info"
          rows={dataTable1}
          columns={columnsTable1}
        />
      </Box>

      {/* Table 2 */}
      <Box>
        <Stack direction="row" spacing={1} mb={1} flexWrap="wrap">
          {["New", "Edit", "View", "Delete", "Print", "Export"].map((label) => (
            <Button
              key={label}
              variant={label === "New" ? "contained" : "outlined"}
              size="small"
            >
              {label}
            </Button>
          ))}
        </Stack>
        <CustomizedDataGrid
          style={{ flex: 1, minHeight: 300 }}
          label="Completion Info"
          rows={dataTable2}
          columns={columnsTable2}
        />
      </Box>
    </Box>
  );
};

export default TabWorkshop;
