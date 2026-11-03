import GenericDataGrid from "@/shared/components/dataGrid/DataGrid";
import { columns } from "./TabCounterAlertColumns";
import { getRowId } from "../CounterAlertUtil";

const TabCounterAlert = ({ counterAlerts }: { counterAlerts: any }) => {
  return (
    <GenericDataGrid
      label="Counter Alerts"
      showToolbar
      disableRowNumber
      rows={counterAlerts}
      columns={columns}
      getRowId={getRowId}
    />
  );
};

export default TabCounterAlert;
