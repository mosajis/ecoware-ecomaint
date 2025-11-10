import { api } from "@/service/axios";
export const login = (data) => api.post("/auth/login", { data });
export const logout = (data) => api.post("/authLogout", { data });
export const authorization = () => api.get("/auth/authorization");
