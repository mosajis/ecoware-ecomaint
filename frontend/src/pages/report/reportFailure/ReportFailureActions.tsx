import DataGridActionBar from "@/shared/components/dataGrid/DataGridActionBar";
import Filter from "@mui/icons-material/FilterList";
import PrintIcon from "@mui/icons-material/Print";

type Props = {
  onFilter: () => void;
  onPrint: () => void;
};

export default function FailureReportActions({ onFilter, onPrint }: Props) {
  const actions = [
    {
      label: "Filter",
      icon: <Filter />,
      isEnabled: true,
      onClick: onFilter,
      disabled: false,
    },
    {
      label: "Close", // closedateTime , flowDesc
      icon: <PrintIcon />,
      onClick: onPrint,
    },
    {
      label: "Open", // Are you shure delete close date close by
      icon: <PrintIcon />,
      onClick: onPrint,
    },
    {
      label: "Print",
      icon: <PrintIcon />,
      onClick: onPrint,
    },
  ];

  return <DataGridActionBar actions={actions} />;
}
