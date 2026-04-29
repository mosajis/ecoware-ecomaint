import { atomUserGroupElements } from "@/app/logic.atom";
import { useAtomValue } from "jotai";

export function usePermission(elementId: number) {
  const userPermissions = useAtomValue(atomUserGroupElements); 
  
  const perms = userPermissions[elementId];
  
  return {
    canCreate: perms?.canCreate || false,
    canUpdate: perms?.canUpdate || false,
    canDelete: perms?.canDelete || false,
    canView: perms?.canView || false,
    canExport: perms?.canExport || false,
  };
}