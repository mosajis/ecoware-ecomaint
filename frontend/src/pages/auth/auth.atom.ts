import { atom } from "jotai";
import type { TypeTblDiscipline, TypeTblUser } from "@/core/api/generated/api";

// Your auth atom
type TypeAuth = {
  authorized: boolean;
  user: null | TypeTblUser;
};
export const atomAuth = atom<TypeAuth>({
  authorized: false,
  user: null,
});

// Derived atom to get the user
export const atomUser = atom((get) => {
  const auth = get(atomAuth);
  return auth.user;
});

export const atomUserDiscipline = atom((get) => {
  const auth = get(atomAuth);
  return auth.user?.tblEmployeeTblUsersEmployeeIdTotblEmployee
    ?.tblDiscipline as TypeTblDiscipline;
});
