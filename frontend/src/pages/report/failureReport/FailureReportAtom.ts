import { atom } from "jotai";
import {
  TypeTblMaintLog,
  TypeTblFailureReports,
} from "@/core/api/generated/api";

export type Type = {
  maintLog: TypeTblMaintLog | null;
  failureReport: TypeTblFailureReports | null;
};

export const atomInitData = atom<Type>({
  maintLog: null,
  failureReport: null,
});
