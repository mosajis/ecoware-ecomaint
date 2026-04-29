import { useEffect } from "react";
import { useAtom } from "jotai";
import { atomUserGroupElements } from "./logic.atom";
import { tblUserGroupElement } from "@/core/api/generated/api";
import { LOCAL_STORAGE } from "@/const";


const AppLogic = () => {
  const [userGroupElements, setUserGroupElements] = useAtom(atomUserGroupElements);

  useEffect(() => {
    const isPersist = localStorage.getItem(LOCAL_STORAGE.IS_PERSIST)
    
    const initData = async () => {
      const res = await tblUserGroupElement.getAll();
      const result: any = {} 
      res.items.forEach(i => {
        const item = {
          canCreate: i.canCreate,
          canExport: i.canExport,
          canDelete: i.canDelete,
          canUpdate: i.canUpdate,
          canView: i.canView,
        }
        result[i.elementId] = item
      })
      setUserGroupElements(result)

      localStorage.setItem(LOCAL_STORAGE.IS_PERSIST, '1')
    };

    
    if (isPersist) {
      initData();
    }
  }, [userGroupElements, setUserGroupElements]);

  return "";
};

export default AppLogic;
