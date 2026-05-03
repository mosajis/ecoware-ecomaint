import { useEffect, useCallback, ReactElement, useState } from "react";
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
import Spinner from "@/shared/components/Spinner";

type Props = {
  children: ReactElement;
};

const AppLogic = ({ children }: Props) => {
  const user = useAtomValue(atomUser);
  const userGroupId = user?.userGroupId as number;
  const userId = user?.userId as number;

  const [, setUserGroupElements] = useAtom(atomUserGroupElements);
  const [, setInstallations] = useAtom(atomInstallations);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // const isPersist = localStorage.getItem(LOCAL_STORAGE.IS_PERSIST) === "1";
  const isPersist = false

  // === Permissions
  const loadPermissions = useCallback(async () => {
    if (!userGroupId) return;

    const res = await tblUserGroupElement.getAll({
      filter: { userGroupId },
    });

    return res.items.reduce<Record<number, any>>((acc, i) => {
      acc[i.elementId] = {
        canCreate: i.canCreate,
        canExport: i.canExport,
        canDelete: i.canDelete,
        canUpdate: i.canUpdate,
        canView: i.canView,
      };
      return acc;
    }, {});
  }, [userGroupId]);

  // === Installations
  const loadInstallations = useCallback(async () => {
    if (!userId) return [];

    const res = await tblUserInstallation.getAll({
      filter: { userId },
      include: { tblInstallation: true },
    });

    return res.items
      .map((i) => i.tblInstallation)
      .filter(Boolean) as TypeTblInstallation[];
  }, [userId]);

  // === Init
  const initData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [permissions, installations] = await Promise.all([
        loadPermissions(),
        loadInstallations(),
      ]);

      if (permissions) setUserGroupElements(permissions);
      if (installations) setInstallations(installations);

      localStorage.setItem(LOCAL_STORAGE.IS_PERSIST, "1");
    } catch (err) {
      console.error(err);
      setError("Failed to load app data");
    } finally {
      setLoading(false);
    }
  }, [loadPermissions, loadInstallations, setUserGroupElements, setInstallations]);

  useEffect(() => {
    if (!isPersist) {
      initData();
    } else {
      setLoading(false);
    }
  }, [isPersist, initData]);

  // === UI Handling
  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return children;
};

export default AppLogic;