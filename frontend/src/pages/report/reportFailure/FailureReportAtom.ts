import { atom } from "jotai";
import {
  TypeTblMaintLog,
  TypeTblFailureReports,
} from "@/core/api/generated/api";

export type FailureReportAtomType = {
  maintLog: TypeTblMaintLog | null;
  failureReport: TypeTblFailureReports | null;
};

export const failureReportAtom = atom<FailureReportAtomType>({
  maintLog: null,
  failureReport: null,
});
