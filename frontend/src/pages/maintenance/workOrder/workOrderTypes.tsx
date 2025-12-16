import {
  TypeTblComponentUnit,
  TypeTblCompStatus,
  TypeTblDiscipline,
  TypeTblJobDescription,
  TypeTblLocation,
  TypeTblPendingType,
  TypeTblPeriod,
  TypeTblWorkOrder,
  TypeTblWorkOrderStatus,
} from "@/core/api/generated/api";

export type TypeTblWorkOrderWithRels = TypeTblWorkOrder & {
  tblComponentUnit?:
    | (TypeTblComponentUnit & {
        tblCompStatus?: TypeTblCompStatus;
        tblLocation?: TypeTblLocation;
      })
    | null;
  tblCompJob?: {
    tblJobDescription?: TypeTblJobDescription;
    tblPeriod?: TypeTblPeriod;
  } | null;
  tblPendingType?: TypeTblPendingType | null;
  tblDiscipline?: TypeTblDiscipline | null;
  tblWorkOrderStatus?: TypeTblWorkOrderStatus | null;
};

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
