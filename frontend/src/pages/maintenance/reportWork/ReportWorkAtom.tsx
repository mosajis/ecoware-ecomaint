import { atom } from "jotai";
import {
  TypeTblComponentUnit,
  TypeTblMaintLog,
} from "@/core/api/generated/api";

export const atomActiveStep = atom(0);

type TypeInitialData = {
  componentUnit: TypeTblComponentUnit | null;
  maintLog: TypeTblMaintLog | null;
};

export const atomInitalData = atom<TypeInitialData>({
  componentUnit: null,
  maintLog: null,
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
  setInitialData({ componentUnit: null, maintLog: null });
  setIsDirty(false);
};
