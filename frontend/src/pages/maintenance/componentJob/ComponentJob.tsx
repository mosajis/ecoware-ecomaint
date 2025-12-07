import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Spinner from "@/shared/components/Spinner";
import Splitter from "@/shared/components/Splitter";

// fake fetch => جای این را با API واقعی خودت عوض کن
async function fetchJobsData() {
  return [
    {
      id: 1,
      roundCode: "R-01",
      roundTitle: "Routine Check",
      compTypeName: "Pump",
      compNo: "P-123",
      jobCode: "JB-441",
      jobTitle: "Inspect Oil Level",
      jobDisiplice: "Mechanical",
      frequency: 30,
      frequencyPeriod: "Days",
      lastDone: "2024-09-01",
      nextDueDate: "2024-10-01",
      realOverDue: 0,
      lastTimeDone: "08:34",
    },
  ];
}

const columns: GridColDef[] = [
  { field: "roundCode", headerName: "Round Code", flex: 1 },
  { field: "roundTitle", headerName: "Round Title", flex: 1 },
  { field: "compTypeName", headerName: "CompType Name", flex: 1 },
  { field: "compNo", headerName: "CompNo", flex: 1 },
  { field: "jobCode", headerName: "Job Code", flex: 1 },
  { field: "jobTitle", headerName: "Job Title", flex: 1 },
  { field: "jobDisiplice", headerName: "Job Disiplice", flex: 1 },
  { field: "frequency", headerName: "Frequency", flex: 1 },
  { field: "frequencyPeriod", headerName: "Frequency Period", flex: 1 },
  { field: "lastDone", headerName: "Last Done", flex: 1 },
  { field: "nextDueDate", headerName: "NextDueDate", flex: 1 },
  { field: "realOverDue", headerName: "RealOverDue", flex: 1 },
  { field: "lastTimeDone", headerName: "LastTimeDone", flex: 1 },
];

export default function ComponentJob() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");

  useEffect(() => {
    const load = async () => {
      const data = await fetchJobsData();
      setRows(data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <Spinner />;

  return (
    <Box height="100%" width="100%">
      <Splitter initialPrimarySize="70%" horizontal>
        <Box sx={{ height: "100%", overflow: "hidden" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            disableRowSelectionOnClick
            sx={{ border: "1px solid", borderColor: "divider" }}
          />
        </Box>

        <Box p={1}>
          <TextField
            fullWidth
            multiline
            minRows={5}
            maxRows={12}
            label="Remarks / Notes"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </Box>
      </Splitter>
    </Box>
  );
}
