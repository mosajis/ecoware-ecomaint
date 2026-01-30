// atoms/apiErrorAtom.ts
import { atom } from "jotai";

export type ApiError = {
  message: string;
  statusCode?: number;
  details?: any;
} | null;

// atom مرکزی
export const AtomApiError = atom<ApiError>(null);
