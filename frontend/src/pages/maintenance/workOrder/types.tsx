export const STATUS = {
  PLAN: "Plan",
  REQUEST: "Request",
  ISSUE: "Issue",
  PENDING: "Pend",
  CONTROL: "Control",
  COMPLETE: "Complete",
  CANCEL: "Cancel",
  POSTPONED: "Postponed",
} as const;

export type TypeWorkOrderStatus = (typeof STATUS)[keyof typeof STATUS];
