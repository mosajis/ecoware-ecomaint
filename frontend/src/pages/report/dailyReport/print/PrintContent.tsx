import MaintLogPrintTable from "./PrintTable";
import { TypeTblDailyReport, TypeTblMaintLog } from "@/core/api/generated/api";

interface Props {
  maintLogs: TypeTblMaintLog[];
  dailyReport: TypeTblDailyReport;
  withRoutine: boolean;
}

const PrintContent = ({ maintLogs, dailyReport, withRoutine }: Props) => {
  const unPlanned = maintLogs.filter((l) => l.unexpected !== 0);
  const planned = maintLogs.filter((l) => l.unexpected === 0);

  const results = withRoutine ? [...unPlanned, ...planned] : [...unPlanned];

  return results.map((log) => (
    <MaintLogPrintTable row={log} key={log.maintLogId} />
  ));
};

export default PrintContent;
