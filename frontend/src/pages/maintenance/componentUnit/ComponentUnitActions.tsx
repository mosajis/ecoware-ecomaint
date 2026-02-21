import DataGridActionBar from "@/shared/components/dataGrid/DataGridActionBar";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import EngineeringRounded from "@mui/icons-material/EngineeringRounded";
import ReportProblemRounded from "@mui/icons-material/ReportProblemRounded";
import { TypeTblComponentUnit } from "@/core/api/generated/api";

type Props = {
  selectedRow: TypeTblComponentUnit | null;
  onRoutine: () => void;
  onNoneRoutine: () => void;
  onFailureReport: () => void;
  onWorkShop: () => void;
};

export default function ComponentUnitActions({
  selectedRow,
  onRoutine,
  onNoneRoutine,
  onFailureReport,
  onWorkShop,
}: Props) {
  const isSelected = !!selectedRow;

  const actions = [
    // {
    //   label: "Routine",
    //   icon: <FilterListIcon />,
    //   onClick: onRoutine,
    //   disabled: !isSelected,
    // },
    {
      label: "None-Routine",
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
      disabled: !isSelected,

      label: "WorkShop",
      icon: <EngineeringRounded />,
      onClick: onWorkShop,
    },
  ];

  return <DataGridActionBar actions={actions} />;
}
