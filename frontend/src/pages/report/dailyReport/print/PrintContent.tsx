import MaintLogPrintTable from "./PrintTable";
import { TypeTblMaintLog } from "@/core/api/generated/api";

interface Props {
  maintLogs: TypeTblMaintLog[];
}

const PrintContent = ({ maintLogs }: Props) => {
  const unPlanned = maintLogs.filter((l) => l.unexpected !== 0);
  const planned = maintLogs.filter((l) => l.unexpected === 0);

  return [...unPlanned, ...planned].map((log) => (
    <MaintLogPrintTable row={log} key={log.maintLogId} />
  ));
};

export default PrintContent;
