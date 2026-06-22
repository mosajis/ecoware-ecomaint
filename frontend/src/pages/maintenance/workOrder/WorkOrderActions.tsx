import DataGridActionBar from "@/shared/components/dataGrid/DataGridActionBar";
import Filter from "@mui/icons-material/FilterList";
import AutoModeIcon from "@mui/icons-material/AutoMode";
import PrintIcon from "@mui/icons-material/Print";
import { WORK_ORDER_ACTIONS } from "./WorkOrderActionsConfig";
import { STATUS } from "./types";

type Props = {
  selectedStatuses: string[];

  onIssue: () => void;
  onComplete: () => void;
  onPending: () => void;
  onPostponed: () => void;
  onCancel: () => void;
  onFilter: () => void;
  onReschedule: () => void;
  onPrint: () => void;
};

export default function WorkOrderActions({
  selectedStatuses,
  onIssue,
  onComplete,
  onPending,
  onPostponed,
  onCancel,
  onFilter,
  onReschedule,
  onPrint,
}: Props) {
  const selectedCount = selectedStatuses.length;

  const actions = [
    {
      label: "Filter",
      icon: <Filter />,
      isEnabled: true,
      onClick: onFilter,
      disabled: false,
    },
    {
      ...WORK_ORDER_ACTIONS.issue,
      onClick: onIssue,
      elementId: 1341,
      disabled:
        selectedCount === 0 ||
        !WORK_ORDER_ACTIONS.issue.isEnabled(selectedStatuses),
    },
    {
      ...WORK_ORDER_ACTIONS.complete,
      onClick: onComplete,
      elementId: 1342,
      disabled:
        selectedCount != 1 ||
        !WORK_ORDER_ACTIONS.complete.isEnabled(selectedStatuses),
    },
    {
      ...WORK_ORDER_ACTIONS.pending,
      onClick: onPending,
      elementId: 1343,

      disabled:
        selectedCount != 1 ||
        !WORK_ORDER_ACTIONS.pending.isEnabled(selectedStatuses),
    },
    {
      ...WORK_ORDER_ACTIONS.postponed,
      onClick: onPostponed,
      elementId: 1344,
      disabled:
        selectedCount === 0 ||
        !WORK_ORDER_ACTIONS.postponed.isEnabled(selectedStatuses),
    },
    {
      ...WORK_ORDER_ACTIONS.cancel,
      onClick: onCancel,
      elementId: 1345,
      disabled:
        selectedCount === 0 ||
        !WORK_ORDER_ACTIONS.cancel.isEnabled(selectedStatuses),
    },
    {
      elementId: 1347,
      label: "ReSchedule",
      icon: <AutoModeIcon />,
      disabled:
        selectedCount != 1 ||
        selectedStatuses.every(
          (s) => s === STATUS.CONTROL || s === STATUS.COMPLETE,
        ),
      onClick: onReschedule,
    },
    {
      elementId: 1348,
      disabled: selectedCount < 1,
      label: "Print",
      icon: <PrintIcon />,
      onClick: onPrint,
    },
  ];

  return <DataGridActionBar actions={actions} />;
}
