import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useCallback } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { useDataGrid } from "../../hooks/useDataGrid";
import {
  tblComponentUnit,
  TypeTblComponentUnit,
} from "@/core/api/generated/api";

interface TabComponentUnitProps {
  compUnitId?: number | null;
  label?: string | null;
}

const columns: GridColDef<TypeTblComponentUnit>[] = [
  {
    field: "compJobId",
    headerName: "CompJobId",
    flex: 1,
    valueGetter: (_, r) => r.compJobId,
  },
  {
    field: "frequency",
    headerName: "Frequency",
    flex: 1,
    valueGetter: (_, r) => r.frequency,
  },
  {
    field: "lastDone",
    headerName: "Last Done",
    flex: 1,
    valueGetter: (_, r) => r.lastDone,
  },
  {
    field: "disciplineName",
    headerName: "Disipline Name",
    flex: 1,
    valueGetter: (_, r) => r.tblDiscipline?.discName,
  },
  {
    field: "nextDueDate",
    headerName: "Next DueDate",
    flex: 1,
    valueGetter: (_, r) => r.nextDueDate,
  },
  {
    field: "priority",
    headerName: "Priority",
    flex: 1,
    valueGetter: (_, r) => r.priority,
  },
  {
    field: "window",
    headerName: "Window",
    flex: 1,
    valueGetter: (_, r) => r.window,
  },
  {
    field: "compNo",
    headerName: "CompNo",
    flex: 1,
    valueGetter: (_, r) => r.tblComponentUnit?.compNo,
  },
  {
    field: "userDefText1",
    headerName: "UserDefText1",
    flex: 1,
    valueGetter: (_, r) => r.tblComponentUnit?.userDefText1,
  },
  {
    field: "serialNo",
    headerName: "Serial No",
    flex: 1,
    valueGetter: (_, r) => r.tblComponentUnit?.serialNo,
  },
  {
    field: "locationName",
    headerName: "Location Name",
    flex: 1,
    valueGetter: (_, r) => r.tblLocation?.locName,
  },
  {
    field: "nextDueDateStr",
    headerName: "NextDueDatestr",
    flex: 1,
    valueGetter: (_, r) => r.nextDueDateStr,
  },
  {
    field: "lastDoneStr",
    headerName: "LastDoneStr",
    flex: 1,
    valueGetter: (_, r) => r.lastDoneStr,
  },
  {
    field: "persianNextDueDate",
    headerName: "Persian Next Due Date",
    flex: 1,
    valueGetter: (_, r) => r.persianNextDueDate,
  },
  {
    field: "persianLastDone",
    headerName: "Persian Last Done",
    flex: 1,
    valueGetter: (_, r) => r.persianLastDone,
  },
];

export default function TabComponentUnit(props: TabComponentUnitProps) {
  const { compUnitId, label } = props;

  const getAll = useCallback(() => {
    return tblComponentUnit.getAll({
      filter: compUnitId ? { compUnitId } : undefined,
      include: {
        tblComponentUnit: true,
        tblLocation: true,
        tblDiscipline: true,
      },
    });
  }, [compUnitId]);

  const { rows, loading, fetchData } = useDataGrid(
    getAll,
    tblComponentUnit.deleteById,
    "compJobId",
    !!compUnitId
  );

  return (
    <CustomizedDataGrid
      rows={rows}
      columns={columns}
      loading={loading}
      label={label || "Component Unit Jobs"}
      showToolbar
      onRefreshClick={fetchData}
      getRowId={(row) => row.compJobId}
    />
  );
}
