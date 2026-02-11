import DataGridActionBar from "@/shared/components/dataGrid/DataGridActionBar";
import Filter from "@mui/icons-material/FilterList";
import AutoModeIcon from "@mui/icons-material/AutoMode";
import PrintIcon from "@mui/icons-material/Print";
import { WORK_ORDER_ACTIONS } from "./WorkOrderActionsConfig";

type Props = {
  selectedStatuses: string[];

  onIssue: () => void;
  onComplete: () => void;
  onPending: () => void;
  onPostponed: () => void;
  onCancel: () => void;
  onRequest: () => void;
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
  onRequest,
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
      disabled:
        selectedCount === 0 ||
        !WORK_ORDER_ACTIONS.issue.isEnabled(selectedStatuses),
    },
    {
      ...WORK_ORDER_ACTIONS.complete,
      onClick: onComplete,
      disabled:
        selectedCount != 1 ||
        !WORK_ORDER_ACTIONS.complete.isEnabled(selectedStatuses),
    },
    {
      ...WORK_ORDER_ACTIONS.pending,
      onClick: onPending,
      disabled:
        selectedCount != 1 ||
        !WORK_ORDER_ACTIONS.pending.isEnabled(selectedStatuses),
    },
    {
      ...WORK_ORDER_ACTIONS.postponed,
      onClick: onPostponed,
      disabled:
        selectedCount === 0 ||
        !WORK_ORDER_ACTIONS.postponed.isEnabled(selectedStatuses),
    },
    {
      ...WORK_ORDER_ACTIONS.cancel,
      onClick: onCancel,
      disabled:
        selectedCount === 0 ||
        !WORK_ORDER_ACTIONS.cancel.isEnabled(selectedStatuses),
    },
    {
      ...WORK_ORDER_ACTIONS.request,
      onClick: onRequest,
    },
    {
      label: "Rescadule",
      icon: <AutoModeIcon />,
      isEnabled: true,
      disabled: false,
      onClick: onReschedule,
    },
    {
      label: "Print",
      icon: <PrintIcon />,
      onClick: onPrint,
    },
  ];

  return <DataGridActionBar actions={actions} />;
}
