import DataGridActionBar, {
  DataGridActionItem,
} from "@/shared/components/dataGrid/DataGridActionBar";
import { TypeTblCompCounter } from "@/core/api/generated/api";

type Props = {
  selectedRowId?: TypeTblCompCounter | null;
  children: React.ReactNode;
  onClickUpdate: () => void;
};

export default function Actions({
  selectedRowId,
  onClickUpdate,
  children,
}: Props) {
  const isSelected = !!selectedRowId;

  const actions: DataGridActionItem[] = [
    {
      label: "Update",
      onClick: onClickUpdate,
      disabled: !isSelected,
      variant: isSelected ? "contained" : "text",
    },
  ];

  return <DataGridActionBar actions={actions}>{children}</DataGridActionBar>;
}
