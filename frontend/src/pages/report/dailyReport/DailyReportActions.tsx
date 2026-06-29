import PrintIcon from "@mui/icons-material/Print";
import DataGridActionBar from "@/shared/components/dataGrid/DataGridActionBar";
import Badge from "@mui/material/Badge";
import FilterList from "@mui/icons-material/FilterList";

import { TypeTblDailyReport } from "@/core/api/generated/api";

type Props = {
  hasFilter: boolean;
  onFilter: () => void;
  onPrint: () => void;
  selected: TypeTblDailyReport | null;
};

export default function DailyReportActions({
  onPrint,
  onFilter,
  selected,
  hasFilter,
}: Props) {
  const actions = [
    {
      label: "Filter",
      icon: (
        <Badge color="warning" variant="dot" invisible={!hasFilter}>
          <FilterList fontSize="small" />
        </Badge>
      ),
      isEnabled: true,
      onClick: onFilter,
      disabled: false,
    },
    {
      label: "Print",
      icon: <PrintIcon fontSize="small" />,
      onClick: onPrint,
      disabled: !selected,
    },
  ];

  return <DataGridActionBar actions={actions} />;
}
