import DataGridActionBar from "@/shared/components/dataGrid/DataGridActionBar";
import FilterListIcon from "@mui/icons-material/FilterList";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import PrintIcon from "@mui/icons-material/Print";
import { TypeTblWorkShop } from "@/core/api/generated/api";

type Props = {
  selectedRow: TypeTblWorkShop | null;
  onFilter: () => void;
  onPrint: () => void;
  onClose: () => void;
  onOpen: () => void;
};

export default function WorkShopActions({
  selectedRow,
  onFilter,
  onPrint,
  onClose,
  onOpen,
}: Props) {
  const isSelected = !!selectedRow;
  const isClosed = !!selectedRow?.closedDate;

  const actions = [
    {
      label: "Filter",
      icon: <FilterListIcon />,
      onClick: onFilter,
      elementId: 1361
    },
    {
      label: "Close",
      icon: <TaskAltIcon />,
      onClick: onClose,
      disabled: !isSelected || isClosed,
      elementId: 1361
    },
    {
      label: "Open",
      icon: <LockOpenIcon />,
      onClick: onOpen,
      disabled: !isSelected || !isClosed,
      elementId: 1362
    },
    {
      label: "Print",
      icon: <PrintIcon />,
      onClick: onPrint,
      disabled: !isSelected,
      elementId: 1362
    },
  ];

  return <DataGridActionBar actions={actions} />;
}
