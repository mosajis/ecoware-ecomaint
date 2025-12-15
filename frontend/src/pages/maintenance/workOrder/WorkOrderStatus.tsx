export const WORK_ORDER_STATUS = {
  PLAN: "Plan",
  REQUEST: "Request",
  ISSUE: "Issue",
  PENDING: "Pend",
  CONTROL: "Control",
  COMPLETE: "Complete",
  CANCEL: "Cancel",
  POSTPONED: "Postponed",
} as const;

export type WorkOrderStatus =
  (typeof WORK_ORDER_STATUS)[keyof typeof WORK_ORDER_STATUS];

export const STATUS_TRANSITIONS: Partial<
  Record<
    WorkOrderStatus,
    {
      allowedFrom: WorkOrderStatus[];
      statusId: number;
      errorMessage: string;
    }
  >
> = {
  Issue: {
    allowedFrom: [WORK_ORDER_STATUS.PLAN, WORK_ORDER_STATUS.REQUEST],
    statusId: 3,
    errorMessage:
      "Issue action is only allowed when the current status is Plan or Request",
  },

  Complete: {
    allowedFrom: [
      WORK_ORDER_STATUS.ISSUE,
      WORK_ORDER_STATUS.PENDING,
      WORK_ORDER_STATUS.POSTPONED,
      WORK_ORDER_STATUS.REQUEST,
    ],
    statusId: 5,
    errorMessage:
      "Complete action is not allowed for Plan, Control, Complete, or Cancel statuses",
  },

  Pend: {
    allowedFrom: [WORK_ORDER_STATUS.ISSUE],
    statusId: 4,
    errorMessage:
      "Pending action is only allowed when the current status is Issue",
  },

  Postponed: {
    allowedFrom: [WORK_ORDER_STATUS.PENDING, WORK_ORDER_STATUS.ISSUE],
    statusId: 8,
    errorMessage:
      "Postponed action is only allowed when the current status is Pending or Issue",
  },
};
