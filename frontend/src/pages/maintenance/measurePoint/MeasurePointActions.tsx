import DataGridActionBar from "@/shared/components/dataGrid/DataGridActionBar";
import BarChartSharp from "@mui/icons-material/BarChartSharp";
import { TypeTblCompMeasurePoint } from "@/core/api/generated/api";

type Props = {
  selectedRow?: TypeTblCompMeasurePoint | null;
  onClickUpdate: () => void;
  onClickTrend: () => void;
};

export default function Actions({
  selectedRow,
  onClickUpdate,
  onClickTrend,
}: Props) {
  const isSelected = !!selectedRow;

  const actions = [
    {
      label: "Update Measure",
      onClick: onClickUpdate,
      disabled: !isSelected,
    },
    {
      label: "Trend",
      icon: <BarChartSharp />,
      onClick: onClickTrend,
      disabled: !isSelected,
    },
  ];

  return <DataGridActionBar actions={actions} />;
}
