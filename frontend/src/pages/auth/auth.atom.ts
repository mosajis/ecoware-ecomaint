import type {DynamicResponse} from "@/core/api/dynamicTypes";
import {atom} from "jotai";

export const atomAuth = atom<DynamicResponse<"getAuthAuthorization">>({
  authorized: false,
  user: null,
});
