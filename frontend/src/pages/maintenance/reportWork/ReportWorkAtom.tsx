import { atom } from "jotai";
import {
  TypeTblComponentUnit,
  TypeTblMaintLog,
} from "@/core/api/generated/api";

export const atomActiveStep = atom(0);

type TypeInitalData = {
  componentUnit: TypeTblComponentUnit | null;
  maintLog: TypeTblMaintLog | null;
};

export const atomInitalData = atom<TypeInitalData>({
  componentUnit: null,
  maintLog: null,
});
