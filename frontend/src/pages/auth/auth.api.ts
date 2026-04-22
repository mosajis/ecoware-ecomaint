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

export const logout = () =>
  api.post<DynamicResponse<"postAuthLogout">>("/auth/logout");

export const authorization = () =>
  api.get<DynamicResponse<"getAuthAuthorization">>("/auth/authorization");
