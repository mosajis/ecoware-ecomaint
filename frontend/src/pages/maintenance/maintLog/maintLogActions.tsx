import DataGridActionBar from "@/shared/components/dataGrid/DataGridActionBar";
import Filter from "@mui/icons-material/FilterList";

type Props = {
  onFilter: () => void;
  onFollow: () => void;
};

export default function MaintLogActions({ onFilter, onFollow }: Props) {
  const actions = [
    {
      label: "Filter",
      icon: <Filter />,
      isEnabled: true,
      onClick: onFilter,
      disabled: false,
    },
    {
      label: "Follow",
      icon: <Filter />,
      isEnabled: true,
      onClick: onFollow,
      disabled: false,
    },
  ];

  return <DataGridActionBar actions={actions} />;
}
