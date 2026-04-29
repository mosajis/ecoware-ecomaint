import { LOCAL_STORAGE } from "@/const";
import { TypeTblUserGroupElement } from "@/core/api/generated/api";
import { atomWithStorage } from "jotai/utils";


export const atomUserGroupElements = atomWithStorage<{[key: number]: TypeTblUserGroupElement}>(LOCAL_STORAGE.USERGROUP_ELEMENTS, {}); 
