import DataGridActionBar from "@/shared/components/dataGrid/DataGridActionBar";
import Add from "@mui/icons-material/Add";
import Remove from "@mui/icons-material/Remove";
import { TypeTblFunction } from "@/core/api/generated/api";
import { PERMIT_ID_FUNCTION_INSTALL } from "./FunctionPermit";

type Props = {
  selectedRow: TypeTblFunction | null;
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
      elementId: PERMIT_ID_FUNCTION_INSTALL
    },
    {
      label: "Remove Component",
      icon: <Remove />,
      onClick: onRemove,
      disabled: !selectedRow || !selectedRow?.compId,
      color: "error" as const,
      elementId: PERMIT_ID_FUNCTION_INSTALL
    },
  ];

  return <DataGridActionBar actions={actions} />;
}
