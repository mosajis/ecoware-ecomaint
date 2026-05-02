import { atomUserGroupElements } from "@/app/logic.atom";
import { useAtomValue } from "jotai";
import { jotaiStore } from "../atoms/jotai.store";

export function getPremission(elementId: number) {
  const userPermissions = jotaiStore.get(atomUserGroupElements);

  const perms = userPermissions[elementId];

  return {
    canCreate: perms?.canCreate ?? false,
    canUpdate: perms?.canUpdate ?? false,
    canDelete: perms?.canDelete ?? false,
    canView: perms?.canView ?? false,
    canExport: perms?.canExport ?? false,
  };
}

export function usePermission(elementId: number) {
  const userPermissions = useAtomValue(atomUserGroupElements);

  const perms = userPermissions[elementId];

  return {
    canCreate: perms?.canCreate ?? true,
    canUpdate: perms?.canUpdate ?? true,
    canDelete: perms?.canDelete ?? true,
    canView: perms?.canView ?? true,
    canExport: perms?.canExport ?? true,
  };
}
