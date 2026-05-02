import { useEffect, useCallback } from "react";
import { useAtom, useAtomValue } from "jotai";

import {
  tblUserGroupElement,
  tblUserInstallation,
  TypeTblInstallation,
} from "@/core/api/generated/api";

import { LOCAL_STORAGE } from "@/const";
import { atomUser } from "@/pages/auth/auth.atom";
import { atomUserGroupElements } from "./logic.atom";
import { atomInstallations } from "@/shared/atoms/general.atom";

const AppLogic = () => {
  const user = useAtomValue(atomUser);
  const userGroupId = user?.userGroupId as number;
  const userId = user?.userId as number;

  const [, setUserGroupElements] = useAtom(atomUserGroupElements);
  const [, setInstallations] = useAtom(atomInstallations);

  const isPersist = localStorage.getItem(LOCAL_STORAGE.IS_PERSIST) === "1";
  // const isPersist = false;

  // === Load permissions
  const loadPermissions = useCallback(async () => {
    if (!userGroupId) return;

    const res = await tblUserGroupElement.getAll({
      filter: { userGroupId },
    });

    const result: Record<number, any> = {};

    res.items.forEach((i) => {
      result[i.elementId] = {
        canCreate: i.canCreate,
        canExport: i.canExport,
        canDelete: i.canDelete,
        canUpdate: i.canUpdate,
        canView: i.canView,
      };
    });

    setUserGroupElements(result);
  }, [userGroupId, setUserGroupElements]);

  // === Load installations
  const loadInstallations = useCallback(async () => {
    const res = await tblUserInstallation.getAll({
      filter: {
        userId,
      },
      include: {
        tblInstallation: true,
      },
    });

    const installations: TypeTblInstallation[] = [];

    res.items.forEach((i) => {
      if (i.tblInstallation) {
        installations.push(i.tblInstallation);
      }
    });

    setInstallations(installations);
  }, [setInstallations]);

  // === Init
  const initData = useCallback(async () => {
    await Promise.all([loadPermissions(), loadInstallations()]);

    localStorage.setItem(LOCAL_STORAGE.IS_PERSIST, "1");
  }, [loadPermissions, loadInstallations]);

  useEffect(() => {
    if (!isPersist) {
      initData();
    }
  }, [isPersist, initData]);

  return null;
};

export default AppLogic;
