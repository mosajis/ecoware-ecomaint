import { atom } from "jotai";
import {
  TypeTblComponentUnit,
  TypeTblMaintLog,
  TypeTblWorkOrder,
} from "@/core/api/generated/api";

export const atomActiveStep = atom(0);

export type TypeInitialData = {
  componentUnit: TypeTblComponentUnit | null;
  maintLog: TypeTblMaintLog | null;
  workOrder: TypeTblWorkOrder | null;
};

export const atomInitalData = atom<TypeInitialData>({
  componentUnit: null,
  maintLog: null,
  workOrder: null,
});

// Track if General step has unsaved changes
export const atomIsDirty = atom(false);

// Helper function to reset all atoms
export const resetReportWorkAtoms = (
  setActiveStep: (value: number) => void,
  setInitialData: (value: TypeInitialData) => void,
  setIsDirty: (value: boolean) => void,
) => {
  setActiveStep(0);
  setInitialData({ componentUnit: null, maintLog: null, workOrder: null });
  setIsDirty(false);
};
