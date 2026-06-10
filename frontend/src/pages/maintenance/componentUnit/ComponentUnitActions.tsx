import DataGridActionBar from "@/shared/components/dataGrid/DataGridActionBar";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import EngineeringRounded from "@mui/icons-material/EngineeringRounded";
import ReportProblemRounded from "@mui/icons-material/ReportProblemRounded";
import { TypeTblComponentUnit } from "@/core/api/generated/api";

export const getComponentUnitActions = ({
  isSelected,
  onRoutine,
  onNoneRoutine,
  onFailureReport,
  onWorkShop,
}: {
  isSelected: boolean;
  onRoutine: () => void;
  onNoneRoutine: () => void;
  onFailureReport: () => void;
  onWorkShop: () => void;
}) => [
  // {
  //   label: "Routine",
  //   icon: <FilterListIcon />,
  //   onClick: onRoutine,
  //   disabled: !isSelected,
  // },
  {
    label: "UnPlanned",
    icon: <TaskAltIcon />,
    onClick: onNoneRoutine,
    disabled: !isSelected,
  },
  {
    label: "Failure Report",
    icon: <ReportProblemRounded />,
    onClick: onFailureReport,
    disabled: !isSelected,
  },
  {
    label: "WorkShop",
    icon: <EngineeringRounded />,
    onClick: onWorkShop,
    disabled: !isSelected,
  },
];

type Props = {
  selectedRow: TypeTblComponentUnit | null;
  onRoutine: () => void;
  onNoneRoutine: () => void;
  onFailureReport: () => void;
  onWorkShop: () => void;
};

export default function ComponentUnitActions(props: Props) {
  const actions = getComponentUnitActions({
    isSelected: !!props.selectedRow,
    onRoutine: props.onRoutine,
    onNoneRoutine: props.onNoneRoutine,
    onFailureReport: props.onFailureReport,
    onWorkShop: props.onWorkShop,
  });

  return <DataGridActionBar actions={actions} />;
}
