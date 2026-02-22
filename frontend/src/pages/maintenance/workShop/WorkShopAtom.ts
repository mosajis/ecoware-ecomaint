import { atom } from "jotai";
import { TypeTblWorkShop, TypeTblMaintLog } from "@/core/api/generated/api";

export type Type = {
  workShop: TypeTblWorkShop | null;
};

export const atomInitData = atom<Type>({
  workShop: null,
});
