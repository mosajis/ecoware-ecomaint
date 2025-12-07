import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid"; // مسیرت رو درست کن

const TabPart = () => {
  const columns = [
    { field: "partName", headerName: "Part Name", flex: 1 },
    { field: "makerRef", headerName: "Maker Ref", flex: 1 },
    { field: "partNo", headerName: "Part No", flex: 1 },
    { field: "extraNo", headerName: "Extra No", flex: 1 },
    { field: "notesDescription", headerName: "Notes Description", flex: 1 },
    { field: "farsiDescription", headerName: "Farsi Description", flex: 1 },
  ];

  const rows = [
    {
      id: "1",
      partName: "Gear A",
      makerRef: "Ref123",
      partNo: "P001",
      extraNo: "E001",
      notesDescription: "High-quality gear.",
      farsiDescription: "چرخ دنده با کیفیت بالا.",
    },
  ];

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Stack direction="row" spacing={1} mb={1}>
        <Button variant="contained" size="small">
          New
        </Button>
        <Button variant="outlined" size="small">
          Export
        </Button>
      </Stack>

      <CustomizedDataGrid
        style={{ flex: 1 }}
        label="Parts"
        rows={rows}
        columns={columns}
      />
    </Box>
  );
};

export default TabPart;
