import { api } from "@/service/axios";
import type {
  DynamicCreate,
  DynamicResponse,
} from "../../core/api/dynamicTypes";

export interface LoginResponse {
  accessToken: string;
}

export const login = async (data: {
  username: string;
  password: string;
}): Promise<LoginResponse> => {
  return await api.post<LoginResponse>("/auth/login", { data });
};

export const logout = (data: DynamicCreate<"postAuthLogout">) =>
  api.post<DynamicResponse<"postAuthLogout">>("/authLogout", { data });

export const authorization = () =>
  api.get<DynamicResponse<"getAuthAuthorization">>("/auth/authorization");
