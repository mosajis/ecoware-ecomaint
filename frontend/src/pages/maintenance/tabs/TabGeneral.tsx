import React from "react";
import {Box, Button, Checkbox, FormControlLabel, InputAdornment, TextField,} from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PrintIcon from "@mui/icons-material/Print";
import DownloadIcon from "@mui/icons-material/Download";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

// Icons for fields
import BusinessIcon from "@mui/icons-material/Business";
import CategoryIcon from "@mui/icons-material/Category";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import FactoryIcon from "@mui/icons-material/Factory";
import MemoryIcon from "@mui/icons-material/Memory";
import CommentIcon from "@mui/icons-material/Comment";
import GroupsIcon from "@mui/icons-material/Groups";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import BuildIcon from "@mui/icons-material/Build";
import InfoIcon from "@mui/icons-material/Info";
import BadgeIcon from "@mui/icons-material/Badge";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";

const TabGeneral = () => {
  const handleSave = () => {
  };

  return (
    <Box display={"flex"} height={"100%"} flexDirection={"column"} justifyContent={"space-between"}>
      <Box display="grid" gap={1} gridTemplateColumns="repeat(3, 1fr)">
        {/* TextFields */}
        <TextField
          label="Comp. Name"
          fullWidth
          // size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <BusinessIcon fontSize="small"/>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Type Name"
          fullWidth
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CategoryIcon fontSize="small"/>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Location"
          fullWidth
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocationOnIcon fontSize="small"/>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Serial Number"
          fullWidth
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <ConfirmationNumberIcon fontSize="small"/>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Maker"
          fullWidth
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FactoryIcon fontSize="small"/>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Model"
          fullWidth
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MemoryIcon fontSize="small"/>
              </InputAdornment>
            ),
          }}
        />

        {[1, 2, 3].map((i) => (
          <TextField
            key={i}
            label={`Comment ${i}`}
            fullWidth
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CommentIcon fontSize="small"/>
                </InputAdornment>
              ),
            }}
          />
        ))}

        <TextField
          label="Parent"
          fullWidth
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <GroupsIcon fontSize="small"/>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Component Type Code"
          fullWidth
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <QrCode2Icon fontSize="small"/>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Model Type"
          fullWidth
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <BuildIcon fontSize="small"/>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Status"
          fullWidth
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <InfoIcon fontSize="small"/>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Asset No"
          fullWidth
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <BadgeIcon fontSize="small"/>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Sort No"
          fullWidth
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FormatListNumberedIcon fontSize="small"/>
              </InputAdornment>
            ),
          }}
        />

        <FormControlLabel control={<Checkbox/>} label="Critical Component"/>
      </Box>
      <Box display="flex" gap={1} >
        <Button size={"small"} variant="contained" startIcon={<SaveIcon/>} onClick={handleSave}>
          Save
        </Button>
        <Button size="small" variant="outlined" startIcon={<AddIcon/>}>
          New
        </Button>
        <Button size="small" variant="outlined" color="error" startIcon={<DeleteIcon/>}>
          Delete
        </Button>
        <Button size="small" variant="outlined" startIcon={<PrintIcon/>}>
          Print
        </Button>
        <Button size="small" variant="outlined" startIcon={<DownloadIcon/>}>
          Download All Attachments
        </Button>
        <Button size="small" variant="outlined" startIcon={<AccountTreeIcon/>}>
          Tree Nodes List
        </Button>
        <Button size="small" variant="outlined" startIcon={<FileDownloadIcon/>}>
          Export to Excel
        </Button>
      </Box>
    </Box>
  );
};

export default TabGeneral;
