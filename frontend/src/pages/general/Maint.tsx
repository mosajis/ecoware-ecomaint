import React from "react";
import { Box } from "@mui/material";
import Splitter from "@/shared/components/Splitter";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";

export default function MaintPage() {
  // ---------------- Maint Type ----------------
  const maintTypeColumns = [
    { field: "description", headerName: "Description", width: 300 },
  ];
  const maintTypeRows = [
    { id: 2, maintType: "MT-002", description: "Machine Calibration" },
  ];

  // ---------------- Maint Class ----------------
  const maintClassColumns = [
    { field: "description", headerName: "Description", width: 300 },
  ];
  const maintClassRows = [
    { id: 1, maintClass: "MC-001", description: "Safety Related" },
    { id: 2, maintClass: "MC-002", description: "Operational" },
  ];

  // ---------------- Maint Cause ----------------
  const maintCauseColumns = [
    { field: "description", headerName: "Description", width: 300 },
  ];
  const maintCauseRows = [
    { id: 2, maintCause: "EL-FAIL", description: "Electrical Failure" },
  ];

  return (
    <Box height="100%" display="flex" flexDirection="column">
      <Splitter initialPrimarySize="34%">
        {/* Panel 1 - Maint Type */}
        <CustomizedDataGrid
          label="Maint Class"
          showToolbar
          rows={maintTypeRows}
          columns={maintTypeColumns}
          onAddClick={() => console.log("Add Maint Type")}
          onRefreshClick={() => console.log("Refresh Maint Type")}
        />

        {/* Panel 2 contains Splitter for Class + Cause */}
        <Splitter initialPrimarySize="50%">
          {/* Panel 2.1 - Maint Class */}
          <CustomizedDataGrid
            label="Maint Type"
            showToolbar
            rows={maintClassRows}
            columns={maintClassColumns}
            onAddClick={() => console.log("Add Maint Class")}
            onRefreshClick={() => console.log("Refresh Maint Class")}
          />

          {/* Panel 2.2 - Maint Cause */}
          <CustomizedDataGrid
            label="Maint Cause"
            showToolbar
            rows={maintCauseRows}
            columns={maintCauseColumns}
            onAddClick={() => console.log("Add Maint Cause")}
            onRefreshClick={() => console.log("Refresh Maint Cause")}
          />
        </Splitter>
      </Splitter>
    </Box>
  );
}
