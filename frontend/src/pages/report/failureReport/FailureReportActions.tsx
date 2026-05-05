import DataGridActionBar from "@/shared/components/dataGrid/DataGridActionBar";
import FilterList from "@mui/icons-material/FilterList";
import Badge from "@mui/material/Badge";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import PrintIcon from "@mui/icons-material/Print";
import { TypeTblFailureReport } from "@/core/api/generated/api";

type Props = {
  selectedRow: TypeTblFailureReport | null;
  hasFilter: boolean;
  onFilter: () => void;
  onPrint: () => void;
  onClose: () => void;
  onOpen: () => void;
};

export default function FailureReportActions({
  hasFilter,
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
      icon: (
        <Badge color="warning" variant="dot" invisible={!hasFilter}>
          <FilterList fontSize="small" />
        </Badge>
      ),
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
