import DataGridActionBar from "@/shared/components/dataGrid/DataGridActionBar";
import FilterListIcon from "@mui/icons-material/FilterList";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import PrintIcon from "@mui/icons-material/Print";
import { TypeTblFailureReports } from "@/core/api/generated/api";

type Props = {
  selectedRow: TypeTblFailureReports | null;
  onFilter: () => void;
  onPrint: () => void;
  onClose: () => void;
  onOpen: () => void;
};

export default function FailureReportActions({
  selectedRow,
  onFilter,
  onPrint,
  onClose,
  onOpen,
}: Props) {
  const isSelected = !!selectedRow;
  const isClosed = !!selectedRow?.closedDateTime;

  const actions = [
    {
      label: "Filter",
      icon: <FilterListIcon />,
      onClick: onFilter,
    },
    {
      label: "Close",
      icon: <TaskAltIcon />,
      onClick: onClose,
      disabled: !isSelected || isClosed,
    },
    {
      label: "Open",
      icon: <LockOpenIcon />,
      onClick: onOpen,
      disabled: !isSelected || !isClosed,
    },
    {
      label: "Print",
      icon: <PrintIcon />,
      onClick: onPrint,
      disabled: !isSelected,
    },
  ];

  return <DataGridActionBar actions={actions} />;
}
