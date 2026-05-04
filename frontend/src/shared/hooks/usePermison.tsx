import { atomUserGroupElements } from "@/app/logic.atom";
import { useAtomValue } from "jotai";
import { jotaiStore } from "../atoms/jotai.store";

export function getPermit(elementId?: number) {
  if (!elementId) {
    return {
      canCreate: true,
      canUpdate: true,
      canDelete: true,
      canView: true,
      canExport: true,
    };
  }
  const userPermissions = jotaiStore.get(atomUserGroupElements);

  const perms = userPermissions[elementId];

  return {
    canCreate: perms?.canCreate || true,
    canUpdate: perms?.canUpdate || true,
    canDelete: perms?.canDelete || true,
    canView: perms?.canView || true,
    canExport: perms?.canExport || true,
  };
}
