import { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Grid,
  TextField,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Splitter from "@/shared/components/Splitter"; // ← مسیر صحیح خودت رو بزار اینجا

function TabPanel({ children, value, index }: any) {
  return value === index ? <Box p={2}>{children}</Box> : null;
}

export default function JobDescription() {
  const [tabIndex, setTabIndex] = useState(0);

  // Fake data for demo
  const rows = [
    {
      id: 1,
      code: "JD-001",
      title: "Engine Check",
      jobClass: "A",
      reason: "Init",
    },
    {
      id: 2,
      code: "JD-002",
      title: "Oil Change",
      jobClass: "B",
      reason: "Update",
    },
  ];

  const columns = [
    { field: "code", headerName: "Job Desc Code", flex: 1 },
    { field: "title", headerName: "Job Desc Title", flex: 1 },
    { field: "jobClass", headerName: "Job Class", flex: 1 },
    { field: "reason", headerName: "Change Reason", flex: 1 },
  ];

  return (
    <Box p={2} display="flex" flexDirection="column" gap={2} height="100%">
      {/* === Tabs Header === */}
      <Tabs
        value={tabIndex}
        onChange={(_, v) => setTabIndex(v)}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="General" />
        <Tab label="MaintLog" />
        <Tab label="Attachment" />
        <Tab label="Component Unit" />
        <Tab label="Triggers" />
        <Tab label="Revision" />
      </Tabs>

      {/* === Tab Panels === */}
      <Box flex={1} overflow="auto">
        {/* --- General Tab --- */}
        <TabPanel value={tabIndex} index={0}>
          <Grid container spacing={2}>
            <TextField fullWidth label="Code" />
            <TextField fullWidth label="Title" />
            <TextField fullWidth label="Job Class" />
            <TextField fullWidth label="Change Reason" />
          </Grid>

          {/* --- Action Buttons --- */}
          <Stack direction="row" spacing={1} mt={2}>
            <Button variant="contained" color="primary">
              New
            </Button>
            <Button variant="contained" color="success">
              Save
            </Button>
            <Button variant="contained" color="error">
              Delete
            </Button>
            <Button variant="outlined">Print</Button>
          </Stack>
        </TabPanel>

        {/* --- MaintLog Tab --- */}
        <TabPanel value={tabIndex} index={1}>
          <Typography>MaintLog Component Here</Typography>
        </TabPanel>

        {/* --- Attachment Tab --- */}
        <TabPanel value={tabIndex} index={2}>
          <Typography>Attachment Component Here</Typography>
        </TabPanel>

        {/* --- Component Unit Tab --- */}
        <TabPanel value={tabIndex} index={3}>
          <Typography>Component Unit Component Here</Typography>
        </TabPanel>

        {/* --- Triggers Tab --- */}
        <TabPanel value={tabIndex} index={4}>
          <Box height={300}>
            <DataGrid
              rows={[{ id: 1, description: "Trigger Example" }]}
              columns={[
                { field: "description", headerName: "Description", flex: 1 },
              ]}
              disableRowSelectionOnClick
            />
          </Box>
        </TabPanel>

        {/* --- Revision Tab --- */}
        <TabPanel value={tabIndex} index={5}>
          <Box height={300}>
            <DataGrid
              rows={[
                {
                  id: 1,
                  version: "1.0",
                  title: "Initial",
                  reason: "Created",
                  changedBy: "Admin",
                  date: "2025-01-01",
                },
              ]}
              columns={[
                { field: "version", headerName: "Job Version No", flex: 1 },
                { field: "title", headerName: "Job Desc Title", flex: 1 },
                { field: "reason", headerName: "Change Reason", flex: 1 },
                { field: "changedBy", headerName: "Changed By", flex: 1 },
                { field: "date", headerName: "Created Date", flex: 1 },
              ]}
              disableRowSelectionOnClick
            />
          </Box>
        </TabPanel>
      </Box>

      {/* === Bottom Split View with Splitter === */}
      <Box flexShrink={0} height="40vh">
        <Splitter
          horizontal={false}
          initialPrimarySize="65%"
          resetOnDoubleClick
          minPrimarySize="30%"
          minSecondarySize="25%"
        >
          {/* Left side: DataGrid */}
          <Box p={1}>
            <Typography variant="subtitle1" mb={1}>
              Job Description List
            </Typography>
            <Box height="100%">
              <DataGrid
                rows={rows}
                columns={columns}
                disableRowSelectionOnClick
              />
            </Box>
          </Box>

          {/* Right side: TextArea */}
          <Box p={1}>
            <Typography variant="subtitle1" mb={1}>
              Description Details
            </Typography>
            <TextField
              label="Description"
              multiline
              fullWidth
              minRows={15}
              placeholder="Enter detailed job description..."
            />
          </Box>
        </Splitter>
      </Box>
    </Box>
  );
}
