import PrintIcon from "@mui/icons-material/Print";
import DataGridActionBar from "@/shared/components/dataGrid/DataGridActionBar";
import { TypeTblDailyReport } from "@/core/api/generated/api";

type Props = {
  onPrint: () => void;
  selected: TypeTblDailyReport | null;
};

export default function DailyReportActions({ onPrint, selected }: Props) {
  const actions = [
    {
      label: "Print",
      icon: <PrintIcon fontSize="small" />,
      onClick: onPrint,
      disabled: !selected,
    },
  ];

  return <DataGridActionBar actions={actions} />;
}
