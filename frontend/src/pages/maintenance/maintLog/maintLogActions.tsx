import DataGridActionBar from "@/shared/components/dataGrid/DataGridActionBar";
import FilterList from "@mui/icons-material/FilterList";
import FollowTheSignsIcon from "@mui/icons-material/FollowTheSigns";
import PrintIcon from "@mui/icons-material/Print";
import { Badge } from "@mui/material";

type Props = {
  onFilter: () => void;
  onFollow: () => void;
  onPrint: () => void;
  hasFilter: boolean;
  selectedCount: number;
};

export default function MaintLogActions({
  onFilter,
  onFollow,
  onPrint,
  hasFilter,
  selectedCount,
}: Props) {
  const actions = [
    {
      label: "Filter",
      icon: (
        <Badge color="warning" variant="dot" invisible={!hasFilter}>
          <FilterList />
        </Badge>
      ),
      isEnabled: true,
      onClick: onFilter,
      disabled: false,
    },
    {
      label: "Follow",
      icon: <FollowTheSignsIcon />,
      isEnabled: true,
      onClick: onFollow,
      disabled: false,
    },
    {
      label: `Print (${selectedCount})`,
      icon: <PrintIcon />,
      isEnabled: true,
      onClick: onPrint,
      disabled: selectedCount === 0,
    },
  ];

  return <DataGridActionBar actions={actions} />;
}
