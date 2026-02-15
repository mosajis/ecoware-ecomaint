import { atom } from "jotai";
import {
  TypeTblComponentUnit,
  TypeTblMaintLog,
  TypeTblWorkOrder,
} from "@/core/api/generated/api";

export type ReportWorkState = {
  maintLog: TypeTblMaintLog | null;
  workOrder: TypeTblWorkOrder | null;
  componentUnit: TypeTblComponentUnit | null;
};

export const reportWorkAtom = atom<ReportWorkState>({
  maintLog: null,
  workOrder: null,
  componentUnit: null,
});
