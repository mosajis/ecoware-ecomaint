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
