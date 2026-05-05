import DataGridActionBar, {
  DataGridActionItem,
} from "@/shared/components/dataGrid/DataGridActionBar";

import { TypeTblJobTrigger } from "@/core/api/generated/api";

type Props = {
  selectedRow: TypeTblJobTrigger;
  onFireTrigger: () => void;
  fireLoading: boolean;
};

export default function Actions({ onFireTrigger, fireLoading }: Props) {
  const actions: DataGridActionItem[] = [
    {
      label: "Fire Trigger",
      onClick: onFireTrigger,
      elementId: 1110,
      variant: "contained",
      loading: fireLoading,
    },
  ];

  return <DataGridActionBar actions={actions} />;
}
