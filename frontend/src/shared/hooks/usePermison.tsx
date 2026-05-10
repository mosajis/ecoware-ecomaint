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
    canCreate: Boolean(perms?.canCreate),
    canUpdate: Boolean(perms?.canUpdate),
    canDelete: Boolean(perms?.canDelete),
    canView: Boolean(perms?.canView),
    canExport: Boolean(perms?.canExport),
  };
}
