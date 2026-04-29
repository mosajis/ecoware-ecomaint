import { LOCAL_STORAGE } from "@/const";
import { TypeTblInstallation } from "@/core/api/generated/api";
import { atomWithStorage } from "jotai/utils";

export const atomSideMenuOpen = atomWithStorage("isSideMenuOpen", true);

export const atomLanguage = atomWithStorage<"en" | "fa">(
  LOCAL_STORAGE.LANG,
  "en",
);

export const atomRig = atomWithStorage(
  "rig",
  null as TypeTblInstallation | null,
);

export const atomInstallations = atomWithStorage(
  "installations",
  [] as TypeTblInstallation[],
);
