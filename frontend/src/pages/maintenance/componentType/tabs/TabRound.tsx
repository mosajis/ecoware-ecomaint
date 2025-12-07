import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { useState } from "react";

export default function TabRound() {
  const [lastDone, setLastDone] = useState(null);
  const [nextDue, setNextDue] = useState(null);

  return (
    <Box>
      <Box
        p={2}
        display="grid"
        gap={2}
        width="100%"
        gridTemplateColumns={"1fr 1fr 1fr"}
      >
        <TextField label="Round Code" fullWidth />
        <TextField label="Round Title" fullWidth />

        <TextField label="Period Frequency" fullWidth type="number" />

        <FormControl fullWidth>
          <InputLabel>Frequency Repeat</InputLabel>
          <Select defaultValue="">
            <MenuItem value="day">Day</MenuItem>
            <MenuItem value="month">Month</MenuItem>
            <MenuItem value="year">Year</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Maintenance Type</InputLabel>
          <Select defaultValue="">
            <MenuItem value="type1">Type 1</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Maintenance Class</InputLabel>
          <Select defaultValue="">
            <MenuItem value="class1">Class 1</MenuItem>
          </Select>
        </FormControl>

        {/*<DatePicker*/}
        {/*  label="Last Done Date"*/}
        {/*  value={lastDone}*/}
        {/*  onChange={setLastDone}*/}
        {/*/>*/}

        {/*<DatePicker*/}
        {/*  label="Next Due Date"*/}
        {/*  value={nextDue}*/}
        {/*  onChange={setNextDue}*/}
        {/*/>*/}

        <FormControl fullWidth>
          <InputLabel>Reporting Method</InputLabel>
          <Select defaultValue="">
            <MenuItem value="report1">Report 1</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Disipline</InputLabel>
          <Select defaultValue="">
            <MenuItem value="dis1">Disipline 1</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Maintenance Cause</InputLabel>
          <Select defaultValue="">
            <MenuItem value="cause1">Cause 1</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Planning Method</InputLabel>
          <Select defaultValue="">
            <MenuItem value="plan1">Plan 1</MenuItem>
          </Select>
        </FormControl>

        <FormControlLabel
          control={<Checkbox />}
          label="Include all jobs when gathering work orders"
        />
      </Box>
      <Box display="flex" gap={1} mt={1}>
        <Button variant="contained" color="primary">
          Save
        </Button>
        <Button variant="outlined">New</Button>
        <Button variant="outlined" color="error">
          Delete
        </Button>
      </Box>
    </Box>
  );
}
