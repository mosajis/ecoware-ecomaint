import { useEffect } from "react";
import { useAtom, useAtomValue } from "jotai";
import { atomUserGroupElements } from "./logic.atom";
import { tblUserGroupElement } from "@/core/api/generated/api";
import { LOCAL_STORAGE } from "@/const";
import { atomUser } from "@/pages/auth/auth.atom";

const AppLogic = () => {
  const user = useAtomValue(atomUser);
  const userGroupId = user?.userGroupId as number;

  const [userGroupElements, setUserGroupElements] = useAtom(
    atomUserGroupElements,
  );

  const isPersist = false;
  // const isPersist = localStorage.getItem(LOCAL_STORAGE.IS_PERSIST)
  useEffect(() => {
    const initData = async () => {
      const res = await tblUserGroupElement.getAll({
        filter: {
          userGroupId,
        },
      });
      const result: any = {};
      res.items.forEach((i) => {
        const item = {
          canCreate: i.canCreate,
          canExport: i.canExport,
          canDelete: i.canDelete,
          canUpdate: i.canUpdate,
          canView: i.canView,
        };
        result[i.elementId] = item;
      });
      setUserGroupElements(result);
      localStorage.setItem(LOCAL_STORAGE.IS_PERSIST, "1");
    };

    if (!isPersist) {
      initData();
    }
  }, [isPersist, setUserGroupElements]);

  return "";
};

export default AppLogic;
