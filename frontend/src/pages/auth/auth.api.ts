import {api} from "@/service/axios";
import type {DynamicCreate, DynamicResponse} from "../../core/api/dynamicTypes";

export const login = (data: DynamicCreate<"postAuthLogin">) =>
  api.post<DynamicResponse<"postAuthLogin">>("/auth/login", { data });

export const logout = (data: DynamicCreate<"postAuthLogout">) =>
  api.post<DynamicResponse<"postAuthLogout">>("/authLogout", { data });

export const authorization = () =>
  api.get<DynamicResponse<"getAuthAuthorization">>("/auth/authorization");
