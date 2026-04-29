import { atomUserGroupElements } from "@/app/logic.atom";
import { useAtomValue } from "jotai";

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
