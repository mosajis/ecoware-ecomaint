import DataGridActionBar from "@/shared/components/dataGrid/DataGridActionBar";
import { WORK_ORDER_ACTIONS } from "./WorkOrderActionsConfig";

type Props = {
  selectedStatuses: string[];

  onIssue: () => void;
  onComplete: () => void;
  onPending: () => void;
  onPostponed: () => void;
  onCancel: () => void;
  onRequest: () => void;
};

export default function WorkOrderActionBar({
  selectedStatuses,
  onIssue,
  onComplete,
  onPending,
  onPostponed,
  onCancel,
  onRequest,
}: Props) {
  const selectedCount = selectedStatuses.length;

  const actions = [
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
        selectedCount === 0 ||
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
      disabled:
        selectedCount === 0 ||
        !WORK_ORDER_ACTIONS.request.isEnabled(selectedStatuses),
    },
  ];

  return <DataGridActionBar actions={actions} />;
}
