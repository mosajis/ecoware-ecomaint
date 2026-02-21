import DataGridActionBar from "@/shared/components/dataGrid/DataGridActionBar";
import Add from "@mui/icons-material/Add";
import Remove from "@mui/icons-material/Remove";
import { TypeTblFunctions } from "@/core/api/generated/api";

type Props = {
  selectedRow: TypeTblFunctions | null;
  onInstall: () => void;
  onRemove: () => void;
};

export default function FunctionActions({
  selectedRow,
  onInstall,
  onRemove,
}: Props) {
  const actions = [
    {
      label: "Install Component",
      icon: <Add />,
      onClick: onInstall,
      disabled: !selectedRow || !!selectedRow?.compId,
    },
    {
      label: "Remove Component",
      icon: <Remove />,
      onClick: onRemove,
      disabled: !selectedRow || !selectedRow?.compId,
      color: "error" as const,
    },
  ];

  return <DataGridActionBar actions={actions} />;
}
