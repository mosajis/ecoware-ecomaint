import { TypeTblDailyReport } from "@/core/api/generated/api";
import { formatDateTime } from "@/core/helper";
import { atomLanguage } from "@/shared/atoms/general.atom";
import { useAtomValue } from "jotai";

type Props = {
  row: TypeTblDailyReport;
};

const CellDailyReportTitle = ({ row }: Props) => {
  const displine = row?.tblDiscipline?.name;
  const lang = useAtomValue(atomLanguage); // 'en' | 'fa'

  const value = row.reportDate;

  if (!value) return "-";

  const formatted = formatDateTime(value, "DATE", lang === "fa");

  return `${displine} - DailyReport - ${formatted}`;
};

export default CellDailyReportTitle;
