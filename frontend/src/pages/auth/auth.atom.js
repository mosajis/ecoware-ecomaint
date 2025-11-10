import { atom } from "jotai";
export const atomAuth = atom({
    authorized: false,
    user: null,
});
