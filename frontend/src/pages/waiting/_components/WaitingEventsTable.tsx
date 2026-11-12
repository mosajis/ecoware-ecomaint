import { TypeWaitingAnalysis } from "@/core/api/api";
import GenericDataGrid from "@/shared/components/dataGrid/DataGrid";
import { columns, getRowId } from "../analysis/AnalysisColumns";

interface Props {
  events: TypeWaitingAnalysis["topEvents"];
}

const WaitingEventsTable = ({ events }: Props) => {
  return (
    <GenericDataGrid rows={events} columns={columns} getRowId={getRowId} />
  );
};

export default WaitingEventsTable;
